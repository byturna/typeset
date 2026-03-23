# CLAUDE.md

## What This Is

A single-page web tool where designers and developers preview font pairings, type scales, and color palettes on a realistic Wikipedia-style article, then export their configuration as CSS, Tailwind, or Figma values.

No authentication. No backend. No persistent state.

## Stack

- Next.js 14+ (App Router), TypeScript, Tailwind CSS
- shadcn/ui (Radix primitives) — install components as needed with `pnpm dlx shadcn@latest add [component]`
- Geist font for tool UI
- Google Fonts CSS API v2 for preview fonts (loaded dynamically)
- pnpm as package manager
- Deploys to Vercel

## Project Structure

```
src/
├── app/                     # Pages + layout
├── components/
│   ├── ui/                  # shadcn components (auto-generated, don't edit)
│   ├── preview/             # Wikipedia article renderer
│   ├── bottom-bar/          # Floating toolbar and controls
│   └── export-modal/        # Export modal with CSS/Tailwind/Figma tabs
├── lib/
│   ├── utils.ts             # shadcn utility (exists)
│   ├── fonts.ts             # Font loading, pairing rules
│   ├── colors.ts            # Palette data, contrast calculation
│   ├── type-scale.ts        # Scale computation from base + ratio
│   ├── export.ts            # Export string generators
│   ├── randomize.ts         # Randomization logic
│   └── state.ts             # useReducer + Context
└── data/
    ├── fonts.json            # Curated font list (~55 fonts)
    └── articles/             # Fake Wikipedia article JSON files
public/
└── images/                   # Placeholder SVGs for articles
```

## What To Build

### Floating Bottom Bar
Centered, max-width 900px, backdrop-blur, shadow, border-radius. Contains:
- Randomize button (randomizes fonts + palette + article)
- Heading font dropdown (searchable, categorized: Sans-Serif, Serif, Display)
- Body font dropdown (same)
- Palette dropdown (pre-made color palettes)
- Export button (opens export modal)
- Small randomize icon inside each dropdown for individual randomization

### Preview Page
A fake Wikipedia article rendered with all common typographic elements: h1, h2, h3, lead paragraph, body paragraphs, blockquote, unordered list, ordered list, data table, info box (floated right on desktop), image with caption, footnotes, inline links, bold, italic, horizontal rule, inline code.

Styled entirely via CSS custom properties on a wrapper element. The preview always uses the user-selected palette colors.

### Export Modal
shadcn Dialog with shadcn Tabs. Three tabs:
- CSS Custom Properties (`:root` block)
- Tailwind Config (partial `theme.extend`)
- Figma Values (plain text: fonts, sizes in px, colors as hex)

Each tab has a copy-to-clipboard button.

### Content
- 3 fake Wikipedia articles stored as JSON in `src/data/articles/`
- ~55 curated Google Fonts stored in `src/data/fonts.json`
- Placeholder SVG images in `public/images/`

## Technical Details

### Font Loading
- Preview fonts loaded dynamically by injecting `<link>` tags for Google Fonts CSS API v2
- Preload top 12 popular fonts on page load
- Track loaded fonts in state to avoid re-fetching
- Show loading indicator while fonts download

### State
- React useReducer + Context. No external state library.
- Nothing persists between sessions. No localStorage.

### CSS Custom Properties
Preview styled through CSS custom properties on a wrapper div. When user changes a value, update the property — no class swapping, no re-rendering.

```
Colors: --color-bg, --color-text, --color-primary, --color-secondary, --color-surface
Fonts: --font-heading, --font-body, --font-weight-heading, --font-weight-body
Sizes: --font-size-sm, --font-size-base, --font-size-md, --font-size-lg, --font-size-xl, --font-size-2xl, --font-size-3xl
Other: --line-height-body, --type-scale
```

### Type Scale
Base: 16px, Ratio: 1.25 (Major Third). Computed sizes:
- sm: 12.8px, base: 16px, md: 20px, lg: 25px, xl: 31.25px, 2xl: 39.06px, 3xl: 48.83px

### Color Palettes
Pre-made palettes, each containing: background, text, primary, secondary, surface. All palettes must pass WCAG AA contrast (4.5:1) between text and background.

### Randomization
- Combined: new font pairing + new palette + new article
- Font rules: heading and body from different categories, display fonts only for headings, monospace excluded from randomization
- Per-dropdown randomize for individual control

### Export Formats
- CSS: `:root` block with custom properties, type scale as rem with formula comments
- Tailwind: partial `tailwind.config.js` theme extension
- Figma: plain text with fonts, weights, type scale in px, colors as hex

## Coding Conventions
- TypeScript strict mode
- File naming: kebab-case for files, PascalCase for components
- Imports use `@/` alias (maps to `src/`)
- One component per file, keep components small
- No inline styles — Tailwind classes or CSS custom properties
- Install shadcn components only when needed
