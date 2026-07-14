import { useState, useEffect, useCallback } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

// Google auth. Degrades gracefully when Firebase isn't configured: stays a
// signed-out guest and signIn is a no-op with a console hint.
export function useAuth() {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!auth) {
      setReady(true)
      return
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setReady(true)
    })
  }, [])

  const signIn = useCallback(() => {
    if (!auth) {
      console.warn('Firebase not configured — set .env vars to enable sign-in.')
      return
    }
    signInWithPopup(auth, googleProvider).catch((e) =>
      console.error('sign-in failed', e),
    )
  }, [])

  const logOut = useCallback(() => {
    if (auth) signOut(auth).catch((e) => console.error('sign-out failed', e))
  }, [])

  return { user, ready, signIn, logOut }
}
