function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const linearize = (v: number) =>
    v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  const R = linearize(r), G = linearize(g), B = linearize(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

/**
 * Returns the WCAG 2.1 contrast ratio between two hex colors.
 * Range: 1 (no contrast) to 21 (black on white).
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(color1)
  const l2 = relativeLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}
