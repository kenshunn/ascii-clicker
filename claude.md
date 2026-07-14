# ASCII Clicker

Incremental clicker game. Players click to earn Bits and spend Bits to unlock
the next printable ASCII character, from '!' (33) up to '~' (126) — 94 tiers.
Each character carries a click multiplier. Owning '~' unlocks Rebirth: a full
reset in exchange for a permanent click multiplier.

## Stack
- Vite + React (JavaScript, no TypeScript)
- framer-motion for ALL animation — no CSS keyframe animations
- Firebase: Auth (Google sign-in) + Firestore (one save document per user)
- Deployed to GitHub Pages via GitHub Actions

## Commands
- npm run dev — local dev server
- npm run build — production build

## Conventions
- Functional components + hooks only
- Pure game logic in src/game/ (no React imports there); UI in src/components/
- Every balance number (costs, multipliers, growth rates) lives in
  src/game/constants.js — never hardcoded in components
- Game state is one plain object owned by a single useReducer; the persistence
  layer serializes it whole
- Number display: suffix notation (1.2K, 3.4M, 5.6B); scientific past 1e15
- Keep components small; extract when a file passes ~150 lines