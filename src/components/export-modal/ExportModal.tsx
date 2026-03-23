'use client'

import { useState } from 'react'
import { Archive, LayoutTemplate, Network, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useTypesetState, useTypesetDispatch } from '@/lib/state'
import { generateCSS, generateTailwind, generateFigma } from '@/lib/export'

function CodeBlock({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

  }

  return (
    <div className="relative">
      <pre className="rounded-lg border border-black/10 bg-gray-50 p-4 text-sm font-mono overflow-auto max-h-[400px] whitespace-pre">
        {content}
      </pre>
      <button
        onClick={copy}
        className={cn(
          'absolute top-2.5 right-2.5 p-1 rounded hover:bg-black/5 transition-colors active:scale-[0.9]',
          copied ? 'text-emerald-600' : 'text-muted-foreground hover:text-foreground',
        )}
        title={copied ? 'Copied!' : 'Copy'}
      >
        <span className="relative flex size-4">
          <Copy className={cn('absolute inset-0 h-4 w-4 transition-opacity duration-150 ease-out', copied ? 'opacity-0' : 'opacity-100')} />
          <Check className={cn('absolute inset-0 h-4 w-4 transition-opacity duration-150 ease-out', copied ? 'opacity-100' : 'opacity-0')} />
        </span>
      </button>
    </div>
  )
}

export function ExportModal() {
  const state = useTypesetState()
  const dispatch = useTypesetDispatch()
  const [activeTab, setActiveTab] = useState('css')

  return (
    <Dialog
      open={state.exportModalOpen}
      onOpenChange={(open) => { if (!open) dispatch({ type: 'TOGGLE_EXPORT' }) }}
    >
      <DialogContent
        className="sm:max-w-lg font-sans duration-200 data-open:zoom-in-[0.98] data-closed:zoom-out-[0.98] data-closed:duration-150"
        style={{ colorScheme: 'light' }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Export</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="css" className="flex-1 gap-1.5">
              <Archive className="h-4 w-4" /> CSS
            </TabsTrigger>
            <TabsTrigger value="tailwind" className="flex-1 gap-1.5">
              <LayoutTemplate className="h-4 w-4" /> Tailwind
            </TabsTrigger>
            <TabsTrigger value="figma" className="flex-1 gap-1.5">
              <Network className="h-4 w-4" /> Figma
            </TabsTrigger>
          </TabsList>
          <TabsContent value="css">
            <CodeBlock content={generateCSS(state)} />
          </TabsContent>
          <TabsContent value="tailwind">
            <CodeBlock content={generateTailwind(state)} />
          </TabsContent>
          <TabsContent value="figma">
            <CodeBlock content={generateFigma(state)} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => dispatch({ type: 'TOGGLE_EXPORT' })}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
