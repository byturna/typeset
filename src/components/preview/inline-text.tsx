import React from 'react'

const INLINE_RE = /\[\^(\d+)\]|`([^`]+)`|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)/g

export function parseInlineText(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  INLINE_RE.lastIndex = 0

  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const [, fnRef, code, bold, italic, linkText, linkHref] = match

    if (fnRef !== undefined) {
      nodes.push(
        <sup key={key++}>
          <a href={`#fn${fnRef}`} className="[color:var(--color-accent)]">
            [{fnRef}]
          </a>
        </sup>
      )
    } else if (code !== undefined) {
      nodes.push(
        <code key={key++} className="bg-[var(--color-surface)] [color:var(--color-body)] px-1 rounded text-[.9em]">
          {code}
        </code>
      )
    } else if (bold !== undefined) {
      nodes.push(<strong key={key++}>{bold}</strong>)
    } else if (italic !== undefined) {
      nodes.push(<em key={key++}>{italic}</em>)
    } else if (linkText !== undefined && linkHref !== undefined) {
      nodes.push(
        <a key={key++} href={linkHref} target="_blank" rel="noopener" className="[color:var(--color-accent)] underline">
          {linkText}
        </a>
      )
    }

    lastIndex = INLINE_RE.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

export function RichText({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{parseInlineText(text)}</span>
}
