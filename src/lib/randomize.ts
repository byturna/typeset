import fontsData from '@/data/fonts.json'
import { palettes } from '@/data/palettes'
import type { FontEntry } from '@/lib/fonts'
import type { Palette } from '@/data/palettes'

const fonts = fontsData as FontEntry[]

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function fallbackFor(cat: FontEntry['category']): string {
  return cat === 'sans-serif' ? 'sans-serif' : 'serif'
}

const HEADING_LINE_HEIGHTS = [1.0, 1.1, 1.2, 1.3, 1.4] as const
const BODY_LINE_HEIGHTS = [1.4, 1.5, 1.6, 1.7, 1.8] as const
const BODY_BASE_SIZES = [15, 16, 17, 18] as const
const BODY_TYPE_SCALES = [1.125, 1.2, 1.25, 1.333] as const

export function randomHeadingFont() {
  const candidates = fonts.filter(f => f.category === 'display' || f.category === 'serif')
  const font = pickRandom(candidates)
  const weight = pickRandom(font.weights)
  const lineHeight = pickRandom(HEADING_LINE_HEIGHTS)
  return { font, weight, lineHeight }
}

export function randomBodyFont() {
  const candidates = fonts.filter(f => f.category === 'sans-serif' || f.category === 'serif')
  const font = pickRandom(candidates)
  const weight = pickRandom(font.weights)
  const baseFontSize = pickRandom(BODY_BASE_SIZES)
  const typeScaleRatio = pickRandom(BODY_TYPE_SCALES)
  const lineHeight = pickRandom(BODY_LINE_HEIGHTS)
  return { font, weight, baseFontSize, typeScaleRatio, lineHeight }
}

export function randomPalette(currentId: string): Palette {
  const candidates = palettes.filter(p => p.id !== currentId)
  return pickRandom(candidates.length ? candidates : palettes)
}

export function paletteToColors(palette: Palette) {
  const { colors } = palette
  const textColor = colors.text ?? colors.heading ?? '#000000'
  return {
    activePaletteId: palette.id,
    bgColor: colors.bg,
    headingColor: colors.heading ?? textColor,
    bodyColor: colors.body ?? textColor,
    accentColor: colors.accent ?? textColor,
    surfaceColor: colors.surface ?? colors.bg,
  }
}

export const ARTICLE_IDS = [
  'irclt',
  'frikandel',
  'cnr',
  'oxford-comma-wars',
  'great-sock-shortage',
  'helvetica',
  'hague-convention-elevator-etiquette',
  'department-miscellaneous-units',
  'pigeon-post-of-basel',
  'loudness-wars',
] as const

export function randomArticleId(currentId: string): string {
  const candidates = ARTICLE_IDS.filter(id => id !== currentId)
  return pickRandom(candidates.length ? candidates : [...ARTICLE_IDS])
}

export function randomizeAll(state: { activePaletteId: string; activeArticleId: string }) {
  const h = randomHeadingFont()
  const b = randomBodyFont()
  const p = randomPalette(state.activePaletteId)
  return {
    headingFont: { name: h.font.name, fallback: fallbackFor(h.font.category) },
    headingWeight: h.weight,
    lineHeightHeading: h.lineHeight,
    bodyFont: { name: b.font.name, fallback: fallbackFor(b.font.category) },
    bodyWeight: b.weight,
    baseFontSize: b.baseFontSize,
    typeScaleRatio: b.typeScaleRatio,
    lineHeightBody: b.lineHeight,
    ...paletteToColors(p),
    activeArticleId: randomArticleId(state.activeArticleId),
  }
}
