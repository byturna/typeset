# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Run production build
pnpm lint         # ESLint

# Add shadcn components as needed (do not pre-install)
pnpm dlx shadcn@latest add [component]
```

## What This Is

A single-page web tool for previewing font pairings, type scales, and color palettes on a fake Wikipedia-style article, then exporting configuration as CSS, Tailwind, or Figma values. No auth, no backend, no persistent state.

## Stack

- Next.js 16 (App Router), React 19, TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui (Radix primitives) — `src/components/ui/` is auto-generated, do not edit
- Geist font for the tool UI chrome (not the preview)
- Google Fonts CSS API v2 for dynamically loaded preview fonts
- pnpm, deploys to Vercel

## Architecture

### State

`useReducer` + React Context in `src/lib/state.ts`. No external state library. Nothing persists to localStorage.

### Preview Styling

The preview article is styled exclusively via CSS custom properties set on a wrapper `div`. When the user changes a value, update the CSS property — no class swapping, no re-rendering the component tree.

```
--color-bg, --color-text, --color-primary, --color-secondary, --color-surface
--font-heading, --font-body, --font-weight-heading, --font-weight-body
--font-size-sm, --font-size-base, --font-size-md, --font-size-lg, --font-size-xl, --font-size-2xl, --font-size-3xl
--line-height-body, --type-scale
```

### Font Loading

Preview fonts load dynamically by injecting `<link>` tags for the Google Fonts CSS API v2. Preload the top 12 popular fonts on page load. Track loaded fonts in state to avoid re-fetching. Show a loading indicator while fonts download.

### Type Scale

Base: 16px, Ratio: 1.25 (Major Third). Sizes: sm=12.8px, base=16px, md=20px, lg=25px, xl=31.25px, 2xl=39.06px, 3xl=48.83px.

### Color Palettes

Pre-made palettes with: background, text, primary, secondary, surface. All palettes must pass WCAG AA contrast (4.5:1) between text and background.

### Randomization Rules

- Combined randomize: new font pairing + new palette + new article
- Heading and body fonts must come from different categories
- Display fonts only for headings; monospace excluded from randomization

## Key Files

```
src/lib/
  state.ts        # useReducer + Context — the single source of truth
  fonts.ts        # Font loading, pairing rules
  colors.ts       # Palette data, contrast calculation
  type-scale.ts   # Scale computation from base + ratio
  export.ts       # CSS/Tailwind/Figma export string generators
  randomize.ts    # Randomization logic

src/data/
  fonts.json              # ~55 curated Google Fonts
  articles/               # 3 fake Wikipedia article JSON files

src/components/
  preview/                # Wikipedia article renderer
  bottom-bar/             # Floating toolbar (fonts, palette, randomize, export)
  export-modal/           # shadcn Dialog + Tabs with copy-to-clipboard
  ui/                     # shadcn auto-generated — do not edit
```

## Coding Conventions

- File names: kebab-case; component names: PascalCase
- Imports use `@/` alias (maps to `src/`)
- One component per file, keep components small
- No inline styles — Tailwind classes or CSS custom properties only
