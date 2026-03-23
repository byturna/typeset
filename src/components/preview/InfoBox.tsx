import { RichText } from './inline-text'
import type { ArticleInfobox } from '@/lib/article'

export function InfoBox({ infobox }: { infobox: ArticleInfobox }) {
  return (
    <div className="float-right ml-6 mb-4 w-72 max-sm:float-none max-sm:w-full overflow-hidden rounded border border-[var(--color-body)]/20">
      <div className="bg-[var(--color-accent)] text-[var(--color-bg)] text-center font-bold text-[length:var(--font-size-sm)] px-3 py-2 [font-family:var(--font-body)]">
        {infobox.type}
      </div>

      {infobox.image && (
        <figure className="m-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={infobox.image} alt={infobox.imageCaption ?? ''} className="w-full" />
          {infobox.imageCaption && (
            <figcaption className="text-[length:var(--font-size-sm)] [color:var(--color-body)] opacity-60 text-center px-3 py-1">
              {infobox.imageCaption}
            </figcaption>
          )}
        </figure>
      )}

      <table className="w-full bg-[var(--color-surface)]">
        <tbody>
          {Object.entries(infobox.fields).map(([label, value]) => (
            <tr key={label} className="border-t border-[var(--color-body)]/10">
              <th className="text-[length:var(--font-size-sm)] [color:var(--color-body)] opacity-80 font-semibold px-3 py-1 align-top text-left w-2/5">
                {label}
              </th>
              <td className="text-[length:var(--font-size-sm)] [color:var(--color-body)] px-3 py-1 align-top">
                <RichText text={value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
