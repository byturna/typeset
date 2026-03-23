import { useEffect } from 'react'
import { useTypesetState } from '@/lib/state'
import { computeTypeScale } from '@/lib/type-scale'
import { preloadFonts } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export function Preview({ children }: { children: React.ReactNode }) {
  const state = useTypesetState()

  useEffect(() => {
    preloadFonts()
  }, [])

  const scale = computeTypeScale(state.baseFontSize, state.typeScaleRatio)

  const cssVars = {
    backgroundColor: 'var(--color-bg)',
    '--color-bg': state.bgColor,
    '--color-heading': state.headingColor,
    '--color-body': state.bodyColor,
    '--color-accent': state.accentColor,
    '--color-surface': state.surfaceColor,
    '--font-heading': `${state.headingFont.name}, ${state.headingFont.fallback}`,
    '--font-body': `${state.bodyFont.name}, ${state.bodyFont.fallback}`,
    '--font-weight-heading': state.headingWeight,
    '--font-weight-body': state.bodyWeight,
    '--font-size-sm': scale.sm.rem,
    '--font-size-base': scale.base.rem,
    '--font-size-md': scale.md.rem,
    '--font-size-lg': scale.lg.rem,
    '--font-size-xl': scale.xl.rem,
    '--font-size-2xl': scale['2xl'].rem,
    '--font-size-3xl': scale['3xl'].rem,
    '--line-height-heading': state.lineHeightHeading,
    '--line-height-body': state.lineHeightBody,
    '--type-scale': state.typeScaleRatio,
  } as React.CSSProperties

  return (
    <div data-preview="" style={cssVars} className="w-full min-h-screen">
      <div className="pb-[80px]">
        <div className="relative">
          <div
            data-preview-content=""
            className={cn(
              'max-w-4xl mx-auto px-6 py-8 transition-opacity ease-out',
              state.fontLoading ? 'opacity-0 duration-0' : 'opacity-100 duration-150',
            )}
          >
            {children}
          </div>
          {state.fontLoading && (
            <div className="absolute inset-0 max-w-4xl mx-auto px-6 py-8 pointer-events-none">
              <Skeleton className="h-10 w-3/4 mb-6" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-8" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
