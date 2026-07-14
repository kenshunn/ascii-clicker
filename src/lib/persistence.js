import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

const LS_KEY = 'ascii-clicker-save'

// Only these fields are game state — pick them so stray keys (e.g. updatedAt)
// never leak into the reducer or get re-persisted.
const FIELDS = [
  'bits',
  'tier',
  'rebirths',
  'rebirthMultiplier',
  'lifetimeClicks',
  'lifetimeBits',
]

function pickState(obj) {
  if (!obj || typeof obj !== 'object') return null
  const out = {}
  for (const k of FIELDS) if (obj[k] !== undefined) out[k] = obj[k]
  return out
}

// ---- localStorage (guest) ----
export function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? pickState(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function saveLocal(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(pickState(state)))
  } catch {
    /* storage full / unavailable — ignore, it's a guest cache */
  }
}

export function clearLocal() {
  try {
    localStorage.removeItem(LS_KEY)
  } catch {
    /* ignore */
  }
}

// ---- Firestore (signed in) ----
export async function loadCloud(uid) {
  if (!db) return null
  const snap = await getDoc(doc(db, 'saves', uid))
  return snap.exists() ? pickState(snap.data()) : null
}

export async function saveCloud(uid, state) {
  if (!db) return
  await setDoc(doc(db, 'saves', uid), {
    ...pickState(state),
    updatedAt: serverTimestamp(),
  })
}
