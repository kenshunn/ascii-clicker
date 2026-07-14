import { motion } from 'framer-motion'
import Logo from './Logo'

// Landing gate shown when signed out and no guest choice yet. Sign in with
// Google, or play as a guest (with a clear warning that guest progress resets).
export default function LoginScreen({ onSignIn, onGuest, canSignIn }) {
  return (
    <motion.div
      className="login-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="login-card"
        initial={{ y: 24, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <div className="login-logo">
          <Logo size="lg" />
        </div>
        <p className="login-tag">Click ASCII. Earn Bits. Ascend to '~'.</p>

        <div className="login-actions">
          <button
            type="button"
            className="google-btn"
            onClick={onSignIn}
            disabled={!canSignIn}
          >
            <span className="g-mark">G</span> Sign in with Google
          </button>
          <button type="button" className="guest-btn" onClick={onGuest}>
            Play as guest
          </button>
        </div>

        <p className="guest-warn">
          ⚠ Guest progress is not saved — it resets when you leave or sign in.
          Sign in with Google to keep your run in the cloud.
        </p>

        {!canSignIn && (
          <p className="login-note">
            Google sign-in unavailable — Firebase is not configured.
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
