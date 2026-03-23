import { computeTypeScale } from './type-scale'
import type { TypesetState } from './state'

// Strip trailing zeros from a rem string: "0.8000rem" → "0.8rem"
function cleanRem(rem: string): string {
  return rem.replace(/(\.\d*?)0+rem$/, '$1rem').replace(/\.rem$/, 'rem')
}

// Format px with no unnecessary trailing zeros: 12.80 → "12.8", 16.00 → "16"
function cleanPx(px: number): string {
  return px.toFixed(2).replace(/\.?0+$/, '')
}

export function generateCSS(state: TypesetState): string {
  const scale = computeTypeScale(state.baseFontSize, state.typeScaleRatio)

  return [
    ':root {',
    '  /* Typography */',
    `  --font-heading: '${state.headingFont.name}', ${state.headingFont.fallback};`,
    `  --font-body: '${state.bodyFont.name}', ${state.bodyFont.fallback};`,
    `  --font-weight-heading: ${state.headingWeight};`,
    `  --font-weight-body: ${state.bodyWeight};`,
    `  --font-size-base: ${state.baseFontSize}px;`,
    `  --type-scale: ${state.typeScaleRatio};`,
    `  --line-height-heading: ${state.lineHeightHeading};`,
    `  --line-height-body: ${state.lineHeightBody};`,
    '',
    '  /* Computed sizes */',
    `  --font-size-sm: ${cleanRem(scale.sm.rem)};`,
    `  --font-size-md: ${cleanRem(scale.md.rem)};`,
    `  --font-size-lg: ${cleanRem(scale.lg.rem)};`,
    `  --font-size-xl: ${cleanRem(scale.xl.rem)};`,
    `  --font-size-2xl: ${cleanRem(scale['2xl'].rem)};`,
    `  --font-size-3xl: ${cleanRem(scale['3xl'].rem)};`,
    '',
    '  /* Colors */',
    `  --color-bg: ${state.bgColor};`,
    `  --color-heading: ${state.headingColor};`,
    `  --color-body: ${state.bodyColor};`,
    `  --color-accent: ${state.accentColor};`,
    `  --color-surface: ${state.surfaceColor};`,
    '}',
  ].join('\n')
}

export function generateTailwind(state: TypesetState): string {
  const scale = computeTypeScale(state.baseFontSize, state.typeScaleRatio)

  const lines = [
    'theme: {',
    '  extend: {',
    '    fontFamily: {',
    `      heading: ['${state.headingFont.name}', '${state.headingFont.fallback}'],`,
    `      body: ['${state.bodyFont.name}', '${state.bodyFont.fallback}'],`,
    '    },',
    '    fontSize: {',
    `      sm: '${cleanRem(scale.sm.rem)}',`,
    `      base: '${cleanRem(scale.base.rem)}',`,
    `      md: '${cleanRem(scale.md.rem)}',`,
    `      lg: '${cleanRem(scale.lg.rem)}',`,
    `      xl: '${cleanRem(scale.xl.rem)}',`,
    `      '2xl': '${cleanRem(scale['2xl'].rem)}',`,
    `      '3xl': '${cleanRem(scale['3xl'].rem)}',`,
    '    },',
    '    fontWeight: {',
    `      heading: '${state.headingWeight}',`,
    `      body: '${state.bodyWeight}',`,
    '    },',
    '    colors: {',
    `      bg: '${state.bgColor}',`,
    `      heading: '${state.headingColor}',`,
    `      body: '${state.bodyColor}',`,
    `      accent: '${state.accentColor}',`,
    `      surface: '${state.surfaceColor}',`,
    '    },',
    '    lineHeight: {',
    `      heading: '${state.lineHeightHeading}',`,
    `      body: '${state.lineHeightBody}',`,
    '    },',
    '  },',
    '}',
  ]

  return lines.join('\n')
}

export function generateFigma(state: TypesetState): string {
  const scale = computeTypeScale(state.baseFontSize, state.typeScaleRatio)

  return [
    'FONTS',
    `Heading: ${state.headingFont.name} — Weight: ${state.headingWeight}`,
    `Body: ${state.bodyFont.name} — Weight: ${state.bodyWeight}`,
    '',
    `TYPE SCALE (ratio: ${state.typeScaleRatio}, base: ${state.baseFontSize}px)`,
    `Caption: ${cleanPx(scale.sm.px)}px`,
    `Body: ${cleanPx(scale.base.px)}px`,
    `H4: ${cleanPx(scale.md.px)}px`,
    `H3: ${cleanPx(scale.lg.px)}px`,
    `H2: ${cleanPx(scale.xl.px)}px`,
    `H1: ${cleanPx(scale['2xl'].px)}px`,
    `Display: ${cleanPx(scale['3xl'].px)}px`,
    '',
    'COLORS',
    `Background: ${state.bgColor}`,
    `Heading: ${state.headingColor}`,
    `Body: ${state.bodyColor}`,
    `Accent: ${state.accentColor}`,
    `Surface: ${state.surfaceColor}`,
    '',
    'LINE HEIGHT',
    `Heading: ${state.lineHeightHeading}`,
    `Body: ${state.lineHeightBody}`,
  ].join('\n')
}
