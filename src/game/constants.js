// All balance numbers live here — never hardcode in components.

// Bits earned per click before any multipliers.
export const BASE_CLICK = 1

// ASCII tier range: '!' (33) .. '~' (126) → 94 tiers.
export const FIRST_CHAR_CODE = 33
export const LAST_CHAR_CODE = 126

// Per-tier growth curves.
export const MULT_GROWTH = 1.18 // multiplier = MULT_GROWTH ** i
export const COST_BASE = 15 // cost = floor(COST_BASE * COST_GROWTH ** i), i>0
export const COST_GROWTH = 1.32

// Rebirth: permanent multiplier = REBIRTH_BASE ** rebirths.
export const REBIRTH_BASE = 2

// Precomputed tier table. Index i is 0-based: tier 0 is '!' (free, owned).
export const CHARACTERS = buildCharacters()

function buildCharacters() {
  const tiers = []
  for (let code = FIRST_CHAR_CODE; code <= LAST_CHAR_CODE; code++) {
    const i = code - FIRST_CHAR_CODE
    tiers.push({
      index: i,
      code,
      glyph: String.fromCharCode(code),
      multiplier: MULT_GROWTH ** i,
      cost: i === 0 ? 0 : Math.floor(COST_BASE * COST_GROWTH ** i),
    })
  }
  return tiers
}
