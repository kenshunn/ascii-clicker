# ASCII Clicker

An incremental clicker game. Click to earn **Bits**, spend them to unlock the
next printable ASCII character — from `!` (33) up to `~` (126), 94 tiers. Each
character carries a click multiplier. Own `~` and you unlock **Rebirth**: a full
reset in exchange for a permanent click multiplier.

**Play:** https://kenshunn.github.io/ascii-clicker/

## Features

- 94 ASCII tiers with escalating multipliers and costs
- Rebirth for a permanent `2^rebirths` multiplier, with a full-screen ASCII rain
- Lifetime stats (clicks, Bits earned, rebirths) that survive rebirth
- Google sign-in + Firestore cloud saves, with a localStorage guest fallback
- Debounced autosave that never blocks clicking; saves flush on tab hide
- All animation via framer-motion

## Stack

- Vite + React (JavaScript, no TypeScript)
- framer-motion for all animation
- Firebase Auth (Google) + Firestore (one save document per user)
- Deployed to GitHub Pages via GitHub Actions

## Local development

```bash
npm install
cp .env.example .env   # then fill in your Firebase web config
npm run dev
```

Without a `.env`, the game still runs as a guest and saves to localStorage.

### Environment variables

From the Firebase console (Project settings → Your apps → Web app config):

| Var | Firebase field |
|-----|----------------|
| `VITE_FB_API_KEY` | `apiKey` |
| `VITE_FB_AUTH_DOMAIN` | `authDomain` |
| `VITE_FB_PROJECT_ID` | `projectId` |
| `VITE_FB_APP_ID` | `appId` |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with the
Firebase config injected from repository secrets (same four names as above) and
publishes `dist/` to GitHub Pages.

## Architecture

- `src/game/` — pure game logic, no React (constants, reducer helpers, number
  formatting). Every balance number lives in `constants.js`.
- `src/lib/` — Firebase init, auth hook, and the persistence layer.
- `src/components/` — small functional UI components.

Game state is one plain object owned by a single `useReducer`; the persistence
layer serializes it whole.

## Credits

Built with the help of **Claude Code** (Anthropic's agentic CLI) for
implementation and **Claude** for design.
