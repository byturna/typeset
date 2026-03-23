export interface ArticleInfobox {
  type: string
  image?: string
  imageCaption?: string
  fields: Record<string, string>
}

export interface ParagraphBlock {
  type: 'paragraph'
  role?: 'lead'
  text: string
}

export interface HeadingBlock {
  type: 'heading'
  level: 2 | 3
  text: string
}

export interface ListBlock {
  type: 'list'
  style: 'ordered' | 'unordered'
  items: string[]
}

export interface TableBlock {
  type: 'table'
  caption: string
  headers: string[]
  rows: string[][]
}

export interface BlockquoteBlock {
  type: 'blockquote'
  text: string
  attribution?: string
}

export interface FootnotesBlock {
  type: 'footnotes'
  items: { id: number; text: string }[]
}

export type ArticleBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | TableBlock
  | BlockquoteBlock
  | FootnotesBlock

export interface Article {
  id: string
  title: string
  slug: string
  category: string
  tags: string[]
  infobox: ArticleInfobox
  content: ArticleBlock[]
}
