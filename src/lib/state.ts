'use client'

import { createContext, useContext, useReducer, createElement, Dispatch } from 'react'
import type { ReactNode } from 'react'
import {
  randomizeAll,
  randomHeadingFont,
  randomBodyFont,
  randomPalette,
  paletteToColors,
  randomArticleId,
} from './randomize'

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface FontValue {
  name: string
  fallback: string
}

type UndoableState = Pick<TypesetState,
  | 'headingFont' | 'bodyFont'
  | 'headingWeight' | 'bodyWeight'
  | 'lineHeightHeading' | 'lineHeightBody'
  | 'baseFontSize' | 'typeScaleRatio'
  | 'bgColor' | 'headingColor' | 'bodyColor' | 'accentColor' | 'surfaceColor'
  | 'activePaletteId'
>

export interface TypesetState {
  // Typography
  headingFont: FontValue
  bodyFont: FontValue
  typeScaleRatio: number
  baseFontSize: number
  lineHeightHeading: number
  lineHeightBody: number
  headingWeight: number
  bodyWeight: number

  // Colors
  bgColor: string
  headingColor: string
  bodyColor: string
  accentColor: string
  surfaceColor: string

  // UI
  activeArticleId: string
  activePaletteId: string
  panelExpanded: boolean
  activeTab: string
  exportModalOpen: boolean
  exportActiveTab: string

  // History
  past: UndoableState[]
  future: UndoableState[]

  // Font loading
  loadedFonts: Set<string>
  fontLoading: boolean
}

// ---------------------------------------------------------------------------
// Default state
// ---------------------------------------------------------------------------

const defaultState: TypesetState = {
  headingFont: { name: 'Playfair Display', fallback: 'serif' },
  bodyFont: { name: 'Inter', fallback: 'sans-serif' },
  typeScaleRatio: 1.25,
  baseFontSize: 16,
  lineHeightHeading: 1.2,
  lineHeightBody: 1.6,
  headingWeight: 700,
  bodyWeight: 400,

  bgColor: '#FFFFFF',
  headingColor: '#1A1A1A',
  bodyColor: '#404040',
  accentColor: '#2563EB',
  surfaceColor: '#F8FAFC',

  activeArticleId: 'irclt',
  activePaletteId: 'paper',
  panelExpanded: true,
  activeTab: 'fonts',
  exportModalOpen: false,
  exportActiveTab: 'css',

  past: [],
  future: [],

  loadedFonts: new Set<string>(),
  fontLoading: false,
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type TypesetAction =
  | { type: 'SET_HEADING_FONT'; payload: FontValue }
  | { type: 'SET_BODY_FONT'; payload: FontValue }
  | { type: 'SET_TYPE_SCALE'; payload: number }
  | { type: 'SET_BASE_SIZE'; payload: number }
  | { type: 'SET_LINE_HEIGHT'; payload: number }
  | { type: 'SET_LINE_HEIGHT_HEADING'; payload: number }
  | { type: 'SET_HEADING_WEIGHT'; payload: number }
  | { type: 'SET_BODY_WEIGHT'; payload: number }
  | { type: 'SET_BG_COLOR'; payload: string }
  | { type: 'SET_HEADING_COLOR'; payload: string }
  | { type: 'SET_BODY_COLOR'; payload: string }
  | { type: 'SET_ACCENT_COLOR'; payload: string }
  | { type: 'SET_SURFACE_COLOR'; payload: string }
  | { type: 'RANDOMIZE_ALL' }
  | { type: 'RANDOMIZE_FONTS' }
  | { type: 'RANDOMIZE_COLORS' }
  | { type: 'SHUFFLE_ARTICLE' }
  | { type: 'RESET_ALL' }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'SET_TAB'; payload: string }
  | { type: 'TOGGLE_EXPORT' }
  | { type: 'SET_EXPORT_TAB'; payload: string }
  | { type: 'MARK_FONT_LOADED'; payload: string }
  | { type: 'SET_FONT_LOADING'; payload: boolean }
  | { type: 'SET_PALETTE'; payload: string }
  | { type: 'COMMIT_RANDOMIZED'; payload: ReturnType<typeof randomizeAll> }
  | { type: 'UNDO' }
  | { type: 'REDO' }

// ---------------------------------------------------------------------------
// Undo/redo helpers
// ---------------------------------------------------------------------------

const UNDOABLE_ACTIONS = new Set([
  'SET_HEADING_FONT', 'SET_BODY_FONT',
  'SET_HEADING_WEIGHT', 'SET_BODY_WEIGHT',
  'SET_LINE_HEIGHT', 'SET_LINE_HEIGHT_HEADING',
  'SET_BASE_SIZE', 'SET_TYPE_SCALE',
  'SET_BG_COLOR', 'SET_HEADING_COLOR', 'SET_BODY_COLOR',
  'SET_ACCENT_COLOR', 'SET_SURFACE_COLOR',
  'SET_PALETTE',
  'RANDOMIZE_ALL', 'RANDOMIZE_FONTS', 'RANDOMIZE_COLORS',
  'COMMIT_RANDOMIZED',
])

function getUndoable(state: TypesetState): UndoableState {
  return {
    headingFont: state.headingFont,
    bodyFont: state.bodyFont,
    headingWeight: state.headingWeight,
    bodyWeight: state.bodyWeight,
    lineHeightHeading: state.lineHeightHeading,
    lineHeightBody: state.lineHeightBody,
    baseFontSize: state.baseFontSize,
    typeScaleRatio: state.typeScaleRatio,
    bgColor: state.bgColor,
    headingColor: state.headingColor,
    bodyColor: state.bodyColor,
    accentColor: state.accentColor,
    surfaceColor: state.surfaceColor,
    activePaletteId: state.activePaletteId,
  }
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function typesetReducer(state: TypesetState, action: TypesetAction): TypesetState {
  // Push snapshot before any undoable action
  if (UNDOABLE_ACTIONS.has(action.type)) {
    state = {
      ...state,
      past: [...state.past.slice(-19), getUndoable(state)],
      future: [],
    }
  }

  switch (action.type) {
    case 'SET_HEADING_FONT':
      return { ...state, headingFont: action.payload }
    case 'SET_BODY_FONT':
      return { ...state, bodyFont: action.payload }
    case 'SET_TYPE_SCALE':
      return { ...state, typeScaleRatio: action.payload }
    case 'SET_BASE_SIZE':
      return { ...state, baseFontSize: action.payload }
    case 'SET_LINE_HEIGHT':
      return { ...state, lineHeightBody: action.payload }
    case 'SET_LINE_HEIGHT_HEADING':
      return { ...state, lineHeightHeading: action.payload }
    case 'SET_HEADING_WEIGHT':
      return { ...state, headingWeight: action.payload }
    case 'SET_BODY_WEIGHT':
      return { ...state, bodyWeight: action.payload }
    case 'SET_BG_COLOR':
      return { ...state, bgColor: action.payload }
    case 'SET_HEADING_COLOR':
      return { ...state, headingColor: action.payload }
    case 'SET_BODY_COLOR':
      return { ...state, bodyColor: action.payload }
    case 'SET_ACCENT_COLOR':
      return { ...state, accentColor: action.payload }
    case 'SET_SURFACE_COLOR':
      return { ...state, surfaceColor: action.payload }
    case 'TOGGLE_PANEL':
      return { ...state, panelExpanded: !state.panelExpanded }
    case 'SET_TAB':
      return { ...state, activeTab: action.payload }
    case 'TOGGLE_EXPORT':
      return { ...state, exportModalOpen: !state.exportModalOpen }
    case 'SET_EXPORT_TAB':
      return { ...state, exportActiveTab: action.payload }
    case 'RANDOMIZE_ALL':
      return { ...state, ...randomizeAll(state) }
    case 'RANDOMIZE_FONTS': {
      const h = randomHeadingFont()
      const b = randomBodyFont()
      return {
        ...state,
        headingFont: { name: h.font.name, fallback: h.font.category === 'sans-serif' ? 'sans-serif' : 'serif' },
        headingWeight: h.weight,
        lineHeightHeading: h.lineHeight,
        bodyFont: { name: b.font.name, fallback: b.font.category === 'sans-serif' ? 'sans-serif' : 'serif' },
        bodyWeight: b.weight,
        baseFontSize: b.baseFontSize,
        typeScaleRatio: b.typeScaleRatio,
        lineHeightBody: b.lineHeight,
      }
    }
    case 'RANDOMIZE_COLORS': {
      const p = randomPalette(state.activePaletteId)
      return { ...state, ...paletteToColors(p) }
    }
    case 'SHUFFLE_ARTICLE':
      return { ...state, activeArticleId: randomArticleId(state.activeArticleId) }
    case 'MARK_FONT_LOADED':
      return { ...state, loadedFonts: new Set([...state.loadedFonts, action.payload]) }
    case 'SET_FONT_LOADING':
      return { ...state, fontLoading: action.payload }
    case 'SET_PALETTE':
      return { ...state, activePaletteId: action.payload }
    case 'COMMIT_RANDOMIZED':
      return { ...state, ...action.payload }
    case 'UNDO': {
      if (!state.past.length) return state
      const prev = state.past[state.past.length - 1]
      return {
        ...state,
        ...prev,
        past: state.past.slice(0, -1),
        future: [getUndoable(state), ...state.future.slice(0, 19)],
      }
    }
    case 'REDO': {
      if (!state.future.length) return state
      const next = state.future[0]
      return {
        ...state,
        ...next,
        past: [...state.past.slice(-19), getUndoable(state)],
        future: state.future.slice(1),
      }
    }
    case 'RESET_ALL':
      return { ...defaultState, loadedFonts: state.loadedFonts }
    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context + Provider
// ---------------------------------------------------------------------------

interface TypesetContextValue {
  state: TypesetState
  dispatch: Dispatch<TypesetAction>
}

const TypesetContext = createContext<TypesetContextValue | null>(null)

export function TypesetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(typesetReducer, defaultState)
  return createElement(TypesetContext.Provider, { value: { state, dispatch } }, children)
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useTypeset() {
  const ctx = useContext(TypesetContext)
  if (!ctx) throw new Error('useTypeset must be used within TypesetProvider')
  return ctx
}

export const useTypesetState = () => useTypeset().state
export const useTypesetDispatch = () => useTypeset().dispatch
