import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Config from Vite env vars (see .env.example). Missing config is tolerated:
// the app still runs as a guest with localStorage saves until you fill .env.
const config = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
}

const configured = Boolean(config.apiKey && config.projectId && config.appId)

export const isConfigured = configured
export const app = configured ? initializeApp(config) : null
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const googleProvider = new GoogleAuthProvider()
