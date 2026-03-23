import { Fragment } from 'react'
import { RichText } from './inline-text'
import { InfoBox } from './InfoBox'
import { DataTable } from './DataTable'
import { Footnotes } from './Footnotes'
import type { Article, ArticleBlock } from '@/lib/article'

function renderBlock(block: ArticleBlock, index: number) {
  switch (block.type) {
    case 'paragraph':
      if (block.role === 'lead') {
        return (
          <p key={index} className="text-[length:var(--font-size-md)] [font-family:var(--font-body)] font-bold [color:var(--color-body)] leading-[var(--line-height-body)] mb-6">
            <RichText text={block.text} />
          </p>
        )
      }
      return (
        <p key={index} className="text-[length:var(--font-size-base)] [font-family:var(--font-body)] [font-weight:var(--font-weight-body)] [color:var(--color-body)] leading-[var(--line-height-body)] mb-4">
          <RichText text={block.text} />
        </p>
      )

    case 'heading':
      if (block.level === 2) {
        return (
          <h2 key={index} className="text-[length:var(--font-size-xl)] [font-family:var(--font-heading)] [font-weight:var(--font-weight-heading)] [color:var(--color-heading)] leading-[var(--line-height-heading)] mt-8 mb-3 border-b border-[var(--color-body)]/20 pb-1">
            {block.text}
          </h2>
        )
      }
      return (
        <h3 key={index} className="text-[length:var(--font-size-lg)] [font-family:var(--font-heading)] [font-weight:var(--font-weight-heading)] [color:var(--color-heading)] leading-[var(--line-height-heading)] mt-6 mb-2">
          {block.text}
        </h3>
      )

    case 'blockquote':
      return (
        <blockquote key={index} className="border-l-4 border-[var(--color-accent)] pl-4 my-4 [color:var(--color-body)] opacity-80">
          <RichText text={block.text} />
          {block.attribution && (
            <cite className="block text-[length:var(--font-size-sm)] opacity-60 mt-1 not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      )

    case 'list':
      if (block.style === 'ordered') {
        return (
          <ol key={index} className="list-decimal list-outside pl-6 mb-4 space-y-1 [font-family:var(--font-body)] [color:var(--color-body)]">
            {block.items.map((item, i) => (
              <li key={i} className="text-[length:var(--font-size-base)] leading-[var(--line-height-body)]">
                <RichText text={item} />
              </li>
            ))}
          </ol>
        )
      }
      return (
        <ul key={index} className="list-disc list-outside pl-6 mb-4 space-y-1 [font-family:var(--font-body)] [color:var(--color-body)]">
          {block.items.map((item, i) => (
            <li key={i} className="text-[length:var(--font-size-base)] leading-[var(--line-height-body)]">
              <RichText text={item} />
            </li>
          ))}
        </ul>
      )

    case 'table':
      return <DataTable key={index} caption={block.caption} headers={block.headers} rows={block.rows} />

    case 'footnotes':
      return <Footnotes key={index} items={block.items} />

    default:
      return null
  }
}

export function ArticleContent({ article }: { article: Article }) {
  const firstParaIndex = article.content.findIndex((b) => b.type === 'paragraph')

  return (
    <article>
      <h1 className="text-[length:var(--font-size-3xl)] [font-family:var(--font-heading)] [font-weight:var(--font-weight-heading)] [color:var(--color-heading)] leading-[var(--line-height-heading)] mb-4">
        {article.title}
      </h1>

      {article.content.map((block, index) => {
        if (index === firstParaIndex) {
          return (
            <Fragment key="infobox-para">
              <InfoBox infobox={article.infobox} />
              {renderBlock(block, index)}
            </Fragment>
          )
        }
        return renderBlock(block, index)
      })}
    </article>
  )
}
