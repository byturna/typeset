'use client'

import { useState } from 'react'
import { Check, Dices, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTypesetState, useTypesetDispatch } from '@/lib/state'
import { useFontLoader } from '@/lib/fonts'
import type { FontEntry } from '@/lib/fonts'
import fontsData from '@/data/fonts.json'
import { randomHeadingFont } from '@/lib/randomize'

const WEIGHT_LABELS: Record<number, string> = {
  300: 'Light', 400: 'Regular', 500: 'Medium',
  600: 'Semi-Bold', 700: 'Bold', 800: 'Extra-Bold', 900: 'Black',
}

const LINE_HEIGHTS = [1.0, 1.1, 1.2, 1.3, 1.4]

const CATEGORIES: Array<{ key: FontEntry['category']; label: string }> = [
  { key: 'serif', label: 'Serif' },
  { key: 'sans-serif', label: 'Sans-Serif' },
  { key: 'display', label: 'Display' },
]

function fallbackFor(cat: FontEntry['category']): string {
  return cat === 'sans-serif' ? 'sans-serif' : 'serif'
}

export function HeadingDropdown() {
  const state = useTypesetState()
  const dispatch = useTypesetDispatch()
  const { loadNamedFont } = useFontLoader()
  const [search, setSearch] = useState('')

  const [hoveredFont, setHoveredFont] = useState<FontEntry | null>(null)
  const fonts = fontsData as FontEntry[]
  const selectedFont = fonts.find(f => f.name === state.headingFont.name)
  const availableWeights = (hoveredFont ?? selectedFont)?.weights ?? [400]

  const filtered = fonts.filter(f =>
    f.category !== 'monospace' &&
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  function selectFont(font: FontEntry) {
    const nearest = font.weights.reduce((prev, cur) =>
      Math.abs(cur - state.headingWeight) < Math.abs(prev - state.headingWeight) ? cur : prev
    )
    dispatch({ type: 'SET_HEADING_FONT', payload: { name: font.name, fallback: fallbackFor(font.category) } })
    if (nearest !== state.headingWeight) {
      dispatch({ type: 'SET_HEADING_WEIGHT', payload: nearest })
    }
    loadNamedFont(font.name)
  }

  function previewFont(font: FontEntry) {
    setHoveredFont(font)
    const el = document.querySelector<HTMLElement>('[data-preview]')
    el?.style.setProperty('--font-heading', `${font.name}, ${fallbackFor(font.category)}`)
  }

  function clearPreview() {
    setHoveredFont(null)
    const el = document.querySelector<HTMLElement>('[data-preview]')
    el?.style.setProperty('--font-heading', `${state.headingFont.name}, ${state.headingFont.fallback}`)
  }

  function randomizeHeading() {
    const { font, weight, lineHeight } = randomHeadingFont()
    dispatch({ type: 'SET_HEADING_FONT', payload: { name: font.name, fallback: fallbackFor(font.category) } })
    dispatch({ type: 'SET_HEADING_WEIGHT', payload: weight })
    dispatch({ type: 'SET_LINE_HEIGHT_HEADING', payload: lineHeight })
    loadNamedFont(font.name)
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden">
      <div className="grid grid-cols-[2fr_1fr_1fr] divide-x divide-black/8">

        {/* Column 1: Font */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-black/8">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fonts…"
              className="flex-1 text-sm bg-transparent outline-none"
            />
            <button
              onClick={randomizeHeading}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Randomize heading"
            >
              <Dices className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-72">
            {CATEGORIES.map(cat => {
              const catFonts = filtered.filter(f => f.category === cat.key)
              if (!catFonts.length) return null
              return (
                <div key={cat.key}>
                  <div className="px-3 py-1.5 text-xs text-muted-foreground">{cat.label}</div>
                  {catFonts.map(font => (
                    <button
                      key={font.name}
                      style={{ fontFamily: `${font.name}, ${fallbackFor(font.category)}` }}
                      onMouseEnter={() => { loadNamedFont(font.name); previewFont(font) }}
                      onMouseLeave={clearPreview}
                      onClick={() => selectFont(font)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors duration-100',
                        state.headingFont.name === font.name ? 'bg-black/5' : 'hover:bg-black/5'
                      )}
                    >
                      {font.name}
                      {state.headingFont.name === font.name && <Check className="h-3.5 w-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Column 2: Weight */}
        <div className="flex flex-col">
          <div className="px-3 py-2 border-b border-black/8 text-sm text-muted-foreground">Weight</div>
          <div className="overflow-y-auto max-h-72">
            {availableWeights.map(w => (
              <button
                key={w}
                onClick={() => dispatch({ type: 'SET_HEADING_WEIGHT', payload: w })}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors duration-100',
                  state.headingWeight === w ? 'bg-black/5' : 'hover:bg-black/5'
                )}
              >
                {`${WEIGHT_LABELS[w] ?? w} (${w})`}
                {state.headingWeight === w && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Column 3: Line Height */}
        <div className="flex flex-col">
          <div className="px-3 py-2 border-b border-black/8 text-sm text-muted-foreground">Line Height</div>
          <div className="overflow-y-auto max-h-72">
            {LINE_HEIGHTS.map(lh => (
              <button
                key={lh}
                onClick={() => dispatch({ type: 'SET_LINE_HEIGHT_HEADING', payload: lh })}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors duration-100',
                  state.lineHeightHeading === lh ? 'bg-black/5' : 'hover:bg-black/5'
                )}
              >
                {lh.toFixed(1)}
                {state.lineHeightHeading === lh && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
