import { RichText } from './inline-text'
import type { TableBlock } from '@/lib/article'

export function DataTable({ caption, headers, rows }: Omit<TableBlock, 'type'>) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-[var(--color-body)]/20">
        <caption className="text-[length:var(--font-size-sm)] [color:var(--color-body)] opacity-60 mb-2 caption-top text-left">
          {caption}
        </caption>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="bg-[var(--color-accent)] text-[var(--color-bg)] px-3 py-2 text-left text-[length:var(--font-size-sm)] font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-[var(--color-surface)]' : ''}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className="px-3 py-2 text-[length:var(--font-size-base)] [font-family:var(--font-body)] [color:var(--color-body)] border-b border-[var(--color-body)]/10"
                >
                  <RichText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
