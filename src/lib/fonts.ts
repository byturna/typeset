'use client'

import { toast } from 'sonner'
import { useTypesetState, useTypesetDispatch } from '@/lib/state'
import fontsData from '@/data/fonts.json'

export interface FontEntry {
  name: string
  category: 'sans-serif' | 'serif' | 'display' | 'monospace'
  weights: number[]
  source?: 'fontshare'
}

const PRELOAD_FONTS = [
  'Inter', 'DM Sans', 'Plus Jakarta Sans', 'Manrope', 'Lato',
  'Source Serif 4', 'Merriweather', 'Lora', 'Playfair Display',
  'JetBrains Mono', 'Space Grotesk', 'Outfit',
]

export function buildFontUrl(entry: FontEntry): string {
  if (entry.source === 'fontshare') {
    const slug = entry.name.toLowerCase().replace(/ /g, '-')
    const weights = entry.weights.join(',')
    return `https://api.fontshare.com/v2/css?f[]=${slug}@${weights}&display=swap`
  }
  const encoded = entry.name.replace(/ /g, '+')
  const joined = entry.weights.join(';')
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${joined}&display=swap`
}

export function injectFontLink(url: string): HTMLLinkElement {
  const existing = document.querySelector<HTMLLinkElement>(`link[href="${url}"]`)
  if (existing) return existing
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
  return link
}

export async function loadFont(entry: FontEntry): Promise<boolean> {
  const url = buildFontUrl(entry)
  const existing = document.querySelector<HTMLLinkElement>(`link[href="${url}"]`)
  if (existing) {
    return existing.dataset.errored !== 'true'
  }
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  return new Promise((resolve) => {
    link.addEventListener('load', () => resolve(true), { once: true })
    link.addEventListener('error', () => {
      link.dataset.errored = 'true'
      resolve(false)
    }, { once: true })
    document.head.appendChild(link)
  })
}

export function preloadFonts(): void {
  const fonts = fontsData as FontEntry[]
  for (const name of PRELOAD_FONTS) {
    const entry = fonts.find((f) => f.name === name)
    if (!entry) continue
    injectFontLink(buildFontUrl(entry))
  }
}

export function useFontLoader() {
  const state = useTypesetState()
  const dispatch = useTypesetDispatch()
  const fonts = fontsData as FontEntry[]

  async function loadNamedFont(name: string): Promise<void> {
    if (state.loadedFonts.has(name)) return
    const entry = fonts.find((f) => f.name === name)
    if (!entry) return
    dispatch({ type: 'SET_FONT_LOADING', payload: true })
    const success = await loadFont(entry)
    if (success) {
      dispatch({ type: 'MARK_FONT_LOADED', payload: name })
    } else {
      toast.error('Custom fonts unavailable — showing system fonts')
    }
    dispatch({ type: 'SET_FONT_LOADING', payload: false })
  }

  return { loadNamedFont }
}
