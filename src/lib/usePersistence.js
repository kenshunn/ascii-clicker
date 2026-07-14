import { useState, useEffect, useRef, useCallback } from 'react'
import { loadCloud, saveCloud } from './persistence'
import { initialState } from '../game/useGame'

const CLOUD_DELAY = 5000 // Firestore autosave debounce

// Progress is tied to a signed-in account only. Signed out is ephemeral:
//   - login: load that account's cloud save (or seed a fresh one)
//   - logout: reset to a fresh run
//   - signed in: debounce saves to Firestore, flush on tab hide/unload
// No localStorage, no guest persistence. Writes never block the click path.
export function usePersistence({ state, load, user, authReady }) {
  const [savedAt, setSavedAt] = useState(0) // flash "saved" when a write lands
  const [synced, setSynced] = useState(false) // gate autosave until load done

  const stateRef = useRef(state)
  stateRef.current = state
  const userRef = useRef(user)
  userRef.current = user
  const prevUidRef = useRef(undefined)
  const timerRef = useRef(null)

  const flash = useCallback(() => setSavedAt(Date.now()), [])

  const saveNow = useCallback(
    (u, s) => {
      const name = u.displayName || u.email || 'Anonymous'
      saveCloud(u.uid, s, { name })
        .then(flash)
        .catch((e) => console.error('cloud save failed', e))
    },
    [flash],
  )

  // Load on login; reset on logout.
  useEffect(() => {
    if (!authReady) return
    const prevUid = prevUidRef.current
    const uid = user?.uid ?? null
    prevUidRef.current = uid

    if (!uid) {
      setSynced(false)
      // Clear the previous account's progress on logout. (No reset needed on
      // the very first guest visit — state is already fresh.)
      if (prevUid) load(initialState)
      return
    }

    let cancelled = false
    setSynced(false)
    async function sync() {
      const cloud = await loadCloud(uid).catch(() => null)
      if (cancelled) return
      load(cloud ?? initialState)
      if (!cloud) {
        const name = user.displayName || user.email || 'Anonymous'
        saveCloud(uid, initialState, { name }).catch(() => {}) // seed new account
      }
      setSynced(true)
    }
    sync()
    return () => {
      cancelled = true
    }
  }, [user, authReady, load])

  // Debounced autosave — signed in only.
  useEffect(() => {
    if (!user || !synced) return
    clearTimeout(timerRef.current)
    const u = user
    const s = state
    timerRef.current = setTimeout(() => saveNow(u, s), CLOUD_DELAY)
    return () => clearTimeout(timerRef.current)
  }, [state, user, synced, saveNow])

  // Flush immediately on tab hide / unload — signed in only.
  useEffect(() => {
    const flush = () => {
      const u = userRef.current
      if (u && synced) saveNow(u, stateRef.current)
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
  }, [synced, saveNow])

  return { savedAt }
}
