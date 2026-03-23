# Typeset

A browser-based tool for previewing font pairings, type scales, and color palettes — rendered on a realistic Wikipedia-style article. Export your configuration as CSS variables, Tailwind tokens, or Figma values.

## Features

- **Font pairing** — browse and combine ~55 curated Google Fonts with smart pairing rules (display fonts for headings, compatible categories)
- **Type scale** — live preview of a modular scale (Major Third, 1.25 ratio) across seven size steps
- **Color palettes** — pre-made palettes with WCAG AA contrast compliance between text and background
- **Article preview** — renders a fake Wikipedia article with real typographic structure: headings, body copy, info boxes, data tables, footnotes
- **Randomize** — generates a new font pairing + palette + article in one click
- **Export** — copy your configuration as CSS custom properties, Tailwind theme values, or Figma token-ready JSON

## Stack

- [Next.js](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Radix primitives)
- [Google Fonts CSS API v2](https://developers.google.com/fonts/docs/css2) for dynamic font loading
- Deployed on [Vercel](https://vercel.com)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

All preview styling is driven by CSS custom properties set on a wrapper `div`. Changing a font or palette updates a property — no component re-renders, no class swapping.

```
--color-bg        --color-text       --color-primary
--color-secondary --color-surface

--font-heading    --font-body
--font-size-sm    --font-size-base   --font-size-md
--font-size-lg    --font-size-xl     --font-size-2xl    --font-size-3xl

--line-height-body  --type-scale
```

Fonts load on demand by injecting `<link>` tags for the Google Fonts API. The top 12 popular fonts are preloaded on page load.

## Project Structure

```
src/
  app/              # Next.js App Router entry
  components/
    bottom-bar/     # Floating toolbar (font, palette, randomize, export controls)
    export-modal/   # Export dialog with CSS / Tailwind / Figma tabs
    preview/        # Wikipedia-style article renderer
    ui/             # shadcn/ui components (auto-generated)
  data/
    fonts.json      # Curated Google Fonts with metadata
    articles/       # Fake Wikipedia article content (JSON)
  lib/
    state.ts        # useReducer + Context — single source of truth
    fonts.ts        # Font loading and pairing logic
    colors.ts       # Palette data and contrast calculation
    type-scale.ts   # Modular scale computation
    export.ts       # CSS / Tailwind / Figma export generators
    randomize.ts    # Randomization logic
```

## License

MIT
