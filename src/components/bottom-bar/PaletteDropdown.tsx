'use client'

import { useState, useCallback } from 'react'
import { Dices } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTypesetState, useTypesetDispatch } from '@/lib/state'
import type { TypesetAction } from '@/lib/state'
import type { Dispatch } from 'react'
import { palettes } from '@/data/palettes'
import type { Palette } from '@/data/palettes'
import { randomPalette } from '@/lib/randomize'
import { getContrastRatio } from '@/lib/colors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerOutput,
  ColorPickerFormat,
} from '@/components/kibo-ui/color-picker'

const CATEGORY_LABELS: Record<Palette['category'], string> = {
  neutral: 'Neutral',
  monochrome: 'Monochrome',
  pastel: 'Pastel',
  warm: 'Warm',
  cool: 'Cool',
  earthy: 'Earthy',
  bold: 'Bold',
  neon: 'Neon',
  colored: 'Colored',
}

const CATEGORY_ORDER: Palette['category'][] = [
  'neutral', 'monochrome', 'pastel', 'warm', 'cool', 'earthy', 'bold', 'neon', 'colored',
]

function applyPalette(palette: Palette, dispatch: Dispatch<TypesetAction>) {
  const { colors } = palette
  const textColor = colors.text ?? colors.heading ?? '#000000'
  dispatch({ type: 'SET_PALETTE', payload: palette.id })
  dispatch({ type: 'SET_BG_COLOR', payload: colors.bg })
  dispatch({ type: 'SET_HEADING_COLOR', payload: colors.heading ?? textColor })
  dispatch({ type: 'SET_BODY_COLOR', payload: colors.body ?? textColor })
  dispatch({ type: 'SET_ACCENT_COLOR', payload: colors.accent ?? textColor })
  dispatch({ type: 'SET_SURFACE_COLOR', payload: colors.surface ?? colors.bg })
}

function getSwatchRoles(palette: Palette): Array<{ key: keyof Palette['colors']; label: string }> {
  const { colors, colorCount } = palette
  const roles: Array<{ key: keyof Palette['colors']; label: string }> = [{ key: 'bg', label: 'Background' }]
  if (colorCount <= 3 && colors.text) {
    roles.push({ key: 'text', label: 'Text' })
  } else {
    if (colors.heading) roles.push({ key: 'heading', label: 'Heading' })
    if (colors.body) roles.push({ key: 'body', label: 'Body' })
  }
  if (colors.accent) roles.push({ key: 'accent', label: 'Accent' })
  if (colors.surface) roles.push({ key: 'surface', label: 'Surface' })
  return roles
}

function getSwatchClashes(key: keyof Palette['colors'], state: ReturnType<typeof useTypesetState>): string[] {
  const clashes: string[] = []
  const { headingColor, bodyColor, accentColor, bgColor, surfaceColor } = state
  switch (key) {
    case 'bg':
      if (getContrastRatio(headingColor, bgColor) < 4.5) clashes.push('Heading')
      if (getContrastRatio(bodyColor, bgColor) < 4.5) clashes.push('Body')
      if (getContrastRatio(accentColor, bgColor) < 4.5) clashes.push('Accent')
      break
    case 'text':
      if (getContrastRatio(headingColor, bgColor) < 4.5) clashes.push('Background')
      if (getContrastRatio(headingColor, surfaceColor) < 4.5) clashes.push('Surface')
      break
    case 'heading':
      if (getContrastRatio(headingColor, bgColor) < 4.5) clashes.push('Background')
      if (getContrastRatio(headingColor, surfaceColor) < 4.5) clashes.push('Surface')
      break
    case 'body':
      if (getContrastRatio(bodyColor, bgColor) < 4.5) clashes.push('Background')
      if (getContrastRatio(bodyColor, surfaceColor) < 4.5) clashes.push('Surface')
      break
    case 'accent':
      if (getContrastRatio(accentColor, bgColor) < 4.5) clashes.push('Background')
      if (getContrastRatio(accentColor, surfaceColor) < 4.5) clashes.push('Surface')
      break
    case 'surface':
      if (getContrastRatio(headingColor, surfaceColor) < 4.5) clashes.push('Heading')
      if (getContrastRatio(bodyColor, surfaceColor) < 4.5) clashes.push('Body')
      if (getContrastRatio(accentColor, surfaceColor) < 4.5) clashes.push('Accent')
      break
  }
  return clashes
}

function getSwatchStateColor(key: keyof Palette['colors'], state: ReturnType<typeof useTypesetState>): string {
  switch (key) {
    case 'bg':      return state.bgColor
    case 'text':    return state.headingColor
    case 'heading': return state.headingColor
    case 'body':    return state.bodyColor
    case 'accent':  return state.accentColor
    case 'surface': return state.surfaceColor
  }
}

export function PaletteDropdown() {
  const state = useTypesetState()
  const dispatch = useTypesetDispatch()
  const [activeSwatch, setActiveSwatch] = useState<keyof Palette['colors']>('bg')

  const selectedPalette = palettes.find(p => p.id === state.activePaletteId) ?? palettes[0]
  const swatchRoles = getSwatchRoles(selectedPalette)
  const activeColor = getSwatchStateColor(activeSwatch, state)

  const hasLowContrast =
    getContrastRatio(state.headingColor, state.bgColor) < 4.5 ||
    getContrastRatio(state.bodyColor, state.bgColor) < 4.5 ||
    getContrastRatio(state.accentColor, state.bgColor) < 4.5 ||
    getContrastRatio(state.headingColor, state.surfaceColor) < 4.5 ||
    getContrastRatio(state.bodyColor, state.surfaceColor) < 4.5 ||
    getContrastRatio(state.accentColor, state.surfaceColor) < 4.5

  const handleColorChange = useCallback((value: unknown) => {
    const [r, g, b] = value as [number, number, number, number]
    const hex = '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')
    switch (activeSwatch) {
      case 'bg':      dispatch({ type: 'SET_BG_COLOR', payload: hex }); break
      case 'text':    dispatch({ type: 'SET_HEADING_COLOR', payload: hex }); dispatch({ type: 'SET_BODY_COLOR', payload: hex }); break
      case 'heading': dispatch({ type: 'SET_HEADING_COLOR', payload: hex }); break
      case 'body':    dispatch({ type: 'SET_BODY_COLOR', payload: hex }); break
      case 'accent':  dispatch({ type: 'SET_ACCENT_COLOR', payload: hex }); break
      case 'surface': dispatch({ type: 'SET_SURFACE_COLOR', payload: hex }); break
    }
  }, [activeSwatch, dispatch])

  function randomizePalette() {
    const palette = randomPalette(state.activePaletteId)
    applyPalette(palette, dispatch)
    setActiveSwatch('bg')
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden">
      <div className="grid grid-cols-[220px_1fr] divide-x divide-black/8">

        {/* LEFT: Palette list */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-black/8">
            <span className="text-sm text-muted-foreground">Palette</span>
            <button
              onClick={randomizePalette}
              title="Randomize palette"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Dices className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-80">
            {CATEGORY_ORDER.map(cat => {
              const group = palettes.filter(p => p.category === cat)
              return (
                <div key={cat}>
                  <div className="px-3 py-1.5 text-xs text-muted-foreground">{CATEGORY_LABELS[cat]}</div>
                  {group.map(palette => (
                    <button
                      key={palette.id}
                      onClick={() => { applyPalette(palette, dispatch); setActiveSwatch('bg') }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors duration-100',
                        state.activePaletteId === palette.id ? 'bg-black/5' : 'hover:bg-black/5',
                      )}
                    >
                      <div className="flex gap-0.5 shrink-0">
                        {Object.values(palette.colors).map((hex, i) => (
                          <span
                            key={i}
                            className="w-4 h-4 rounded-sm border border-black/10 inline-block shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                      {palette.name}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Customize — grid so the divider spans full height */}
        <div className="grid grid-cols-[190px_1fr] divide-x divide-black/8">

            {/* Swatch list */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b border-black/8">
                <span className="text-sm text-muted-foreground">Components</span>
              </div>
              <div className="py-2">
                {swatchRoles.map(({ key, label }) => {
                  const hex = getSwatchStateColor(key, state)
                  const clashes = getSwatchClashes(key, state)
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSwatch(key)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 text-sm text-left w-full transition-colors duration-100',
                        activeSwatch === key ? 'bg-black/5' : 'hover:bg-black/5',
                      )}
                    >
                      <span
                        className="w-12 h-5 rounded border border-black/10 inline-block shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="flex-1">{label}</span>
                      {clashes.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              onClick={e => e.stopPropagation()}
                              className="text-amber-500 shrink-0"
                            >
                              <TriangleAlert className="h-3.5 w-3.5" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Low contrast with: {clashes.join(', ')}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </button>
                  )
                })}
                {/* Add a color — placeholder */}
                <button
                  disabled
                  className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground opacity-40 cursor-not-allowed"
                >
                  <span className="w-12 h-5 rounded border border-dashed border-black/20 inline-block shrink-0" />
                  Add a color
                </button>
              </div>
            </div>

            {/* Color picker */}
            <div className="flex flex-col">
          <div className="px-3 py-2 border-b border-black/8 text-sm text-muted-foreground">
            Customize {selectedPalette.name}
          </div>
            <div className="p-3 flex flex-col gap-3">
              <ColorPicker key={`${activeSwatch}-${selectedPalette.id}`} value={activeColor} onChange={handleColorChange}>
                <ColorPickerSelection className="h-32 rounded" />
                <div className="flex gap-2 items-center">
                  <ColorPickerEyeDropper />
                  <div className="flex flex-col gap-2 flex-1">
                    <ColorPickerHue />
                    <ColorPickerAlpha />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <ColorPickerOutput />
                  <ColorPickerFormat className="flex-1" />
                </div>
              </ColorPicker>
              {hasLowContrast && (
                <Alert variant="destructive" className="py-2">
                  <TriangleAlert className="h-4 w-4" />
                  <AlertDescription>
                    Low contrast — text may be hard to read
                  </AlertDescription>
                </Alert>
              )}
            </div>
            </div>
          </div>

      </div>
    </div>
  )
}
