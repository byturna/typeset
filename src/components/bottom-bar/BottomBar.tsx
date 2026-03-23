'use client'

import { useState, useEffect, useRef } from 'react'
import { Dices, Undo2, Redo2, ChevronDown, CodeXml } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTypesetState, useTypesetDispatch } from '@/lib/state'
import { useFontLoader } from '@/lib/fonts'
import { palettes } from '@/data/palettes'
import { HeadingDropdown } from './HeadingDropdown'
import { BodyDropdown } from './BodyDropdown'
import { PaletteDropdown } from './PaletteDropdown'

type Panel = 'heading' | 'body' | 'palette'

export function BottomBar({ onRandomize }: { onRandomize: () => void }) {
  const state = useTypesetState()
  const dispatch = useTypesetDispatch()
  const { loadNamedFont } = useFontLoader()
  const [openPanel, setOpenPanel] = useState<Panel | null>(null)
  const [closingPanel, setClosingPanel] = useState<Panel | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load fonts whenever heading or body font changes (e.g. after COMMIT_RANDOMIZED)
  useEffect(() => {
    loadNamedFont(state.headingFont.name)
    loadNamedFont(state.bodyFont.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.headingFont.name, state.bodyFont.name])

  useEffect(() => {
    if (!openPanel) return
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePanel(openPanel!)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [openPanel])

  function closePanel(panel: Panel) {
    setClosingPanel(panel)
    setTimeout(() => {
      setOpenPanel(null)
      setClosingPanel(null)
    }, 150)
  }

  function toggle(panel: Panel) {
    if (openPanel === panel) {
      closePanel(panel)
    } else {
      setClosingPanel(null)
      setOpenPanel(panel)
    }
  }

  const paletteName = palettes.find(p => p.id === state.activePaletteId)?.name ?? 'Paper'

  function renderPanel(panel: Panel) {
    const isOpen = openPanel === panel
    const isClosing = closingPanel === panel
    if (!isOpen && !isClosing) return null
    const animClass = isClosing ? 'animate-dropdown-out' : 'animate-dropdown-in'
    return (
      <div className={animClass}>
        {panel === 'heading' && <HeadingDropdown />}
        {panel === 'body' && <BodyDropdown />}
        {panel === 'palette' && <PaletteDropdown />}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 font-sans">
      <div className="relative">
        {(openPanel !== null || closingPanel !== null) && (
          <div className="absolute bottom-full mb-2 left-0 right-0">
            {renderPanel('heading')}
            {renderPanel('body')}
            {renderPanel('palette')}
          </div>
        )}
        <div className={cn(
          'bottom-bar',
          'flex items-center gap-1 p-2',
          'rounded-2xl border border-black/8',
          'shadow-xl',
        )}>
          <Button
            variant="outline"
            onClick={onRandomize}
            className="gap-2 active:scale-[0.97]"
          >
            <Dices className="h-4 w-4" />
            Randomize
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => dispatch({ type: 'UNDO' })}
                disabled={state.past.length === 0}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => dispatch({ type: 'REDO' })}
                disabled={state.future.length === 0}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>


          <button
            aria-expanded={openPanel === 'heading'}
            onClick={() => toggle('heading')}
            className={cn(
              'h-9 px-3 rounded-xl border text-sm font-medium',
              'transition cursor-pointer duration-100',
              'flex items-center gap-2 w-48',
              'border-black/10 bg-transparent hover:bg-black/5 active:scale-[0.97]',
              'aria-expanded:border-black/30 aria-expanded:bg-black/5',
            )}
          >
            <span className="flex-1 text-left truncate">Heading: {state.headingFont.name}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          </button>

          <button
            aria-expanded={openPanel === 'body'}
            onClick={() => toggle('body')}
            className={cn(
              'h-9 px-3 rounded-xl border text-sm font-medium',
              'transition cursor-pointer duration-100',
              'flex items-center gap-2 w-44',
              'border-black/10 bg-transparent hover:bg-black/5 active:scale-[0.97]',
              'aria-expanded:border-black/30 aria-expanded:bg-black/5',
            )}
          >
            <span className="flex-1 text-left truncate">Body: {state.bodyFont.name}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          </button>

          <button
            aria-expanded={openPanel === 'palette'}
            onClick={() => toggle('palette')}
            className={cn(
              'h-9 px-3 rounded-xl border text-sm font-medium',
              'transition cursor-pointer duration-100',
              'flex items-center gap-2 w-44',
              'border-black/10 bg-transparent hover:bg-black/5 active:scale-[0.97]',
              'aria-expanded:border-black/30 aria-expanded:bg-black/5',
            )}
          >
            <span className="flex-1 text-left truncate">Palette: {paletteName}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          </button>

          <Button
            onClick={() => dispatch({ type: 'TOGGLE_EXPORT' })}
            className="gap-2 active:scale-[0.97]"
          >
            <CodeXml className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}
