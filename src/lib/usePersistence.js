import { useState, useEffect, useRef, useCallback } from 'react'
import {
  loadLocal,
  saveLocal,
  clearLocal,
  loadCloud,
  saveCloud,
} from './persistence'

const GUEST_DELAY = 1000 // localStorage debounce
const CLOUD_DELAY = 5000 // Firestore debounce

// Coordinates saves/loads without ever blocking the click path. All writes are
// fire-and-forget. Flow:
//   - guest: debounce to localStorage (1s)
//   - signed in: debounce to Firestore (5s), flush on hide/unload
//   - on login: load cloud; if guest save has more lifetime bits, ask
export function usePersistence({ state, load, user, authReady }) {
  const [savedAt, setSavedAt] = useState(0) // flash "saved" when a write lands
  const [conflict, setConflict] = useState(null)
  const [synced, setSynced] = useState(false) // gate autosave until first load done

  const stateRef = useRef(state)
  stateRef.current = state
  const userRef = useRef(user)
  userRef.current = user
  const prevUidRef = useRef(undefined)
  const timerRef = useRef(null)

  const flash = useCallback(() => setSavedAt(Date.now()), [])

  const persistNow = useCallback(
    (u, s) => {
      if (u) {
        saveCloud(u.uid, s)
          .then(flash)
          .catch((e) => console.error('cloud save failed', e))
      } else {
        saveLocal(s)
        flash()
      }
    },
    [flash],
  )

  // Initial load + auth transitions.
  useEffect(() => {
    if (!authReady) return
    const prevUid = prevUidRef.current
    const uid = user?.uid ?? null
    prevUidRef.current = uid

    // Logout: keep in-memory progress; just persist locally from now on.
    if (prevUid && !uid) {
      setSynced(true)
      return
    }

    let cancelled = false
    async function sync() {
      if (uid) {
        const cloud = await loadCloud(uid).catch(() => null)
        const local = loadLocal()
        if (cancelled) return
        const localBits = local?.lifetimeBits ?? 0
        const cloudBits = cloud?.lifetimeBits ?? 0
        if (local && cloud && localBits > cloudBits) {
          setConflict({ local, cloud, uid }) // ask; stay unsynced until resolved
          return
        }
        const chosen = cloud ?? local
        if (chosen) load(chosen)
        if (!cloud && local) saveCloud(uid, local).catch(() => {}) // seed cloud
        clearLocal()
      } else {
        const local = loadLocal()
        if (local) load(local)
      }
      if (!cancelled) setSynced(true)
    }
    sync()
    return () => {
      cancelled = true
    }
  }, [user, authReady, load])

  const resolveConflict = useCallback(
    (choice) => {
      if (!conflict) return
      const chosen = choice === 'local' ? conflict.local : conflict.cloud
      load(chosen)
      saveCloud(conflict.uid, chosen).then(flash).catch(() => {})
      clearLocal()
      setSynced(true)
      setConflict(null)
    },
    [conflict, load, flash],
  )

  // Debounced autosave on state change.
  useEffect(() => {
    if (!synced) return
    clearTimeout(timerRef.current)
    const delay = user ? CLOUD_DELAY : GUEST_DELAY
    const u = user
    const s = state
    timerRef.current = setTimeout(() => persistNow(u, s), delay)
    return () => clearTimeout(timerRef.current)
  }, [state, user, synced, persistNow])

  // Flush immediately on tab hide / unload.
  useEffect(() => {
    const flush = () => {
      if (synced) persistNow(userRef.current, stateRef.current)
    }
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [synced, persistNow])

  return { savedAt, conflict, resolveConflict }
}
