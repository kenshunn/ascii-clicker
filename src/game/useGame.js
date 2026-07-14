import { useReducer, useCallback } from 'react'
import { BASE_CLICK, FIRST_CHAR_CODE } from './constants'

// The whole game is one plain object. The persistence layer (later) will
// serialize this shape verbatim.
export const initialState = {
  bits: 0,
  charCode: FIRST_CHAR_CODE, // current owned character, starts at '!'
}

// Pure reducer — no React, no side effects.
export function reducer(state, action) {
  switch (action.type) {
    case 'CLICK':
      return { ...state, bits: state.bits + clickValue(state) }
    default:
      return state
  }
}

// Bits gained per click given current state. Central so tiers/rebirth can
// scale it later without touching components.
export function clickValue(_state) {
  return BASE_CLICK
}

// Convenience derived value: the character the player currently clicks.
export function currentChar(state) {
  return String.fromCharCode(state.charCode)
}

// Hook wrapper. Components consume this, never the reducer directly.
export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const click = useCallback(() => dispatch({ type: 'CLICK' }), [])
  return { state, dispatch, click }
}
