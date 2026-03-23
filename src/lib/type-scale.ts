export interface TypeScaleResult {
  sm:    { px: number; rem: string }
  base:  { px: number; rem: string }
  md:    { px: number; rem: string }
  lg:    { px: number; rem: string }
  xl:    { px: number; rem: string }
  '2xl': { px: number; rem: string }
  '3xl': { px: number; rem: string }
}

function toStep(base: number, ratio: number, exponent: number): { px: number; rem: string } {
  const px = Math.round(base * Math.pow(ratio, exponent) * 100) / 100
  const rem = (px / 16).toFixed(4) + 'rem'
  return { px, rem }
}

export function computeTypeScale(baseFontSize: number, typeScaleRatio: number): TypeScaleResult {
  return {
    sm:    toStep(baseFontSize, typeScaleRatio, -1),
    base:  toStep(baseFontSize, typeScaleRatio,  0),
    md:    toStep(baseFontSize, typeScaleRatio,  1),
    lg:    toStep(baseFontSize, typeScaleRatio,  2),
    xl:    toStep(baseFontSize, typeScaleRatio,  3),
    '2xl': toStep(baseFontSize, typeScaleRatio,  4),
    '3xl': toStep(baseFontSize, typeScaleRatio,  5),
  }
}
