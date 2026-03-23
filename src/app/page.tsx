'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Preview } from '@/components/preview/Preview'
import { ArticleContent } from '@/components/preview/ArticleContent'
import { BottomBar } from '@/components/bottom-bar/BottomBar'
import { ExportModal } from '@/components/export-modal/ExportModal'
import { cn } from '@/lib/utils'
import { useTypesetState, useTypesetDispatch } from '@/lib/state'
import { randomizeAll, ARTICLE_IDS } from '@/lib/randomize'
import { loadFont } from '@/lib/fonts'
import fontsData from '@/data/fonts.json'
import ircltArticle from '@/data/articles/irclt_article.json'
import frikandelArticle from '@/data/articles/frikandel_article.json'
import cnrArticle from '@/data/articles/cnr_article.json'
import oxfordCommaWarsArticle from '@/data/articles/ocw.json'
import greatSockShortageArticle from '@/data/articles/gss.json'
import helveticaArticle from '@/data/articles/helvetica.json'
import hagueConventionArticle from '@/data/articles/hcee.json'
import departmentMiscUnitsArticle from '@/data/articles/dmu.json'
import pigeonPostArticle from '@/data/articles/ppb.json'
import loudnessWarsArticle from '@/data/articles/lw.json'
import type { Article } from '@/lib/article'
import type { FontEntry } from '@/lib/fonts'

const ARTICLES = {
  irclt: ircltArticle,
  frikandel: frikandelArticle,
  cnr: cnrArticle,
  'oxford-comma-wars': oxfordCommaWarsArticle,
  'great-sock-shortage': greatSockShortageArticle,
  'helvetica': helveticaArticle,
  'hague-convention-elevator-etiquette': hagueConventionArticle,
  'department-miscellaneous-units': departmentMiscUnitsArticle,
  'pigeon-post-of-basel': pigeonPostArticle,
  'loudness-wars': loudnessWarsArticle,
}

const FADE_OUT_MS = 250
const FADE_IN_MS = 350

export default function Home() {
  const state = useTypesetState()
  const dispatch = useTypesetDispatch()
  const [displayedArticleId, setDisplayedArticleId] = useState(state.activeArticleId)
  const [articleVisible, setArticleVisible] = useState(true)
  const animating = useRef(false)
  const randomizeLock = useRef(false)
  const skipArticleAnim = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const articleQueueRef = useRef<string[]>([])

  const previewRef = useRef<HTMLDivElement>(null)

  // Normal article transition (dropdowns/undo — not randomize)
  useEffect(() => {
    if (state.activeArticleId === displayedArticleId) return
    if (animating.current) return
    if (skipArticleAnim.current) {
      skipArticleAnim.current = false
      setDisplayedArticleId(state.activeArticleId)
      return
    }
    animating.current = true
    const t1 = setTimeout(() => setArticleVisible(false), 0)
    const t2 = setTimeout(() => {
      setDisplayedArticleId(state.activeArticleId)
      setArticleVisible(true)
      animating.current = false
    }, 75)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [state.activeArticleId, displayedArticleId])

  function dequeueArticle(currentId: string): string {
    if (articleQueueRef.current.length === 0) {
      const rest = (ARTICLE_IDS as readonly string[]).filter(id => id !== currentId)
      articleQueueRef.current = [...rest].sort(() => Math.random() - 0.5)
    }
    return articleQueueRef.current.shift()!
  }

  const handleRandomize = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (randomizeLock.current) return
      randomizeLock.current = true

    const nextPartial = { ...randomizeAll(state), activeArticleId: dequeueArticle(state.activeArticleId) }
    const nextFull = { ...state, ...nextPartial }

    // Pre-load new fonts
    const fonts = fontsData as FontEntry[]
    const hEntry = fonts.find(f => f.name === nextFull.headingFont.name)
    const bEntry = fonts.find(f => f.name === nextFull.bodyFont.name)
    if (hEntry) loadFont(hEntry)
    if (bEntry) loadFont(bEntry)

    const el = previewRef.current
    if (!el) {
      dispatch({ type: 'COMMIT_RANDOMIZED', payload: nextPartial })
      randomizeLock.current = false
      return
    }

    // Phase 1: fade + blur out
    el.style.transition = `opacity ${FADE_OUT_MS}ms ease-out, filter ${FADE_OUT_MS}ms ease-out`
    el.style.opacity = '0'
    el.style.filter = 'blur(8px)'

    setTimeout(() => {
      // Commit new state while content is invisible
      dispatch({ type: 'MARK_FONT_LOADED', payload: nextPartial.headingFont.name })
      dispatch({ type: 'MARK_FONT_LOADED', payload: nextPartial.bodyFont.name })
      skipArticleAnim.current = true
      dispatch({ type: 'COMMIT_RANDOMIZED', payload: nextPartial })
      setDisplayedArticleId(nextPartial.activeArticleId)

      // Phase 2: fade + blur in (next frame so new content is rendered)
      requestAnimationFrame(() => {
        el.style.transition = `opacity ${FADE_IN_MS}ms ease-out, filter ${FADE_IN_MS}ms ease-out`
        el.style.opacity = '1'
        el.style.filter = 'blur(0px)'

        setTimeout(() => {
          el.style.transition = ''
          el.style.opacity = ''
          el.style.filter = ''
          randomizeLock.current = false
        }, FADE_IN_MS)
      })
    }, FADE_OUT_MS)
  }, 300)
}, [state, dispatch])

  const article = ARTICLES[displayedArticleId as keyof typeof ARTICLES] ?? ircltArticle

  return (
    <>
      <Preview>
        <div
          ref={previewRef}
          className={cn('transition-opacity duration-75', articleVisible ? 'opacity-100' : 'opacity-0')}
        >
          <ArticleContent article={article as Article} />
        </div>
      </Preview>

      <BottomBar onRandomize={handleRandomize} />
      <ExportModal />
    </>
  )
}
