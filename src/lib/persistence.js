import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
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

export async function saveCloud(uid, state, profile) {
  if (!db) return
  const clean = pickState(state)
  await Promise.all([
    // Private full save.
    setDoc(doc(db, 'saves', uid), { ...clean, updatedAt: serverTimestamp() }),
    // Public leaderboard mirror: name + the ranked stats only.
    setDoc(doc(db, 'leaderboard', uid), {
      name: profile?.name || 'Anonymous',
      lifetimeBits: clean?.lifetimeBits ?? 0,
      lifetimeClicks: clean?.lifetimeClicks ?? 0,
      rebirths: clean?.rebirths ?? 0,
      updatedAt: serverTimestamp(),
    }),
  ])
}

// Top players by lifetime Bits earned. Public read.
export async function loadLeaderboard(n = 20) {
  if (!db) return []
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('lifetimeBits', 'desc'),
    limit(n),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
}
