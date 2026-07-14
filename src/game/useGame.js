import { useReducer, useCallback } from 'react'
import { BASE_CLICK, CHARACTERS, REBIRTH_BASE } from './constants'

// The whole game is one plain object. The persistence layer (later) will
// serialize this shape verbatim.
export const initialState = {
  bits: 0,
  tier: 0, // index into CHARACTERS; everyone starts owning tier 0 ('!')
  rebirths: 0,
  rebirthMultiplier: 1, // REBIRTH_BASE ** rebirths; 1 until first rebirth
  // Lifetime stats — survive rebirth.
  lifetimeClicks: 0,
  lifetimeBits: 0,
}

// Pure reducer — no side effects.
export function reducer(state, action) {
  switch (action.type) {
    case 'CLICK': {
      const gain = clickValue(state)
      return {
        ...state,
        bits: state.bits + gain,
        lifetimeBits: state.lifetimeBits + gain,
        lifetimeClicks: state.lifetimeClicks + 1,
      }
    }
    case 'BUY': {
      const next = nextTier(state)
      if (!next || state.bits < next.cost) return state
      // Buying a tier makes it the current character.
      return { ...state, bits: state.bits - next.cost, tier: next.index }
    }
    case 'LOAD':
      // Replace whole state from a save; defaults fill any missing fields.
      return { ...initialState, ...action.payload }
    case 'REBIRTH': {
      if (!canRebirth(state)) return state
      const rebirths = state.rebirths + 1
      // Reset run; keep lifetime stats + rebirth count.
      return {
        ...state,
        bits: 0,
        tier: 0,
        rebirths,
        rebirthMultiplier: REBIRTH_BASE ** rebirths,
      }
    }
    default:
      return state
  }
}

// Bits gained per click. Central so tiers/rebirth scale it without touching UI.
export function clickValue(state) {
  return BASE_CLICK * CHARACTERS[state.tier].multiplier * state.rebirthMultiplier
}

// The tier object the player currently owns/clicks.
export function currentTier(state) {
  return CHARACTERS[state.tier]
}

// The glyph the player currently clicks.
export function currentChar(state) {
  return CHARACTERS[state.tier].glyph
}

// Next buyable tier, or null at the cap ('~').
export function nextTier(state) {
  return CHARACTERS[state.tier + 1] ?? null
}

// The next `count` locked tiers, nearest first (for the sidebar).
export function upcomingTiers(state, count) {
  return CHARACTERS.slice(state.tier + 1, state.tier + 1 + count)
}

// True once the player owns '~' (the last tier) — unlocks rebirth.
export function canRebirth(state) {
  return state.tier === CHARACTERS.length - 1
}

// Hook wrapper. Components consume this, never the reducer directly.
export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const click = useCallback(() => dispatch({ type: 'CLICK' }), [])
  const buy = useCallback(() => dispatch({ type: 'BUY' }), [])
  const rebirth = useCallback(() => dispatch({ type: 'REBIRTH' }), [])
  const load = useCallback((payload) => dispatch({ type: 'LOAD', payload }), [])
  return { state, dispatch, click, buy, rebirth, load }
}
