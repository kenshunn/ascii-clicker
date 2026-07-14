import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

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

// Progress is stored per account only — Firestore doc saves/<uid>.
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
