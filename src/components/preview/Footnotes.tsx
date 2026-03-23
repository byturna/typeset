import { parseInlineText } from './inline-text'
import type { FootnotesBlock } from '@/lib/article'

export function Footnotes({ items }: Pick<FootnotesBlock, 'items'>) {
  return (
    <section id="footnotes" className="mt-12 pt-4 border-t border-[var(--color-body)]/20">
      <div className="text-[length:var(--font-size-lg)] [font-family:var(--font-heading)] [font-weight:var(--font-weight-heading)] [color:var(--color-heading)] mb-3">
        References
      </div>
      <ol className="list-decimal list-outside pl-6 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            id={`fn${item.id}`}
            className="text-[length:var(--font-size-sm)] [font-family:var(--font-body)] [color:var(--color-body)] opacity-70 leading-relaxed"
          >
            {parseInlineText(item.text)}{' '}
            <a href={`#fnref${item.id}`} className="[color:var(--color-accent)]">
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
