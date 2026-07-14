import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGame, currentChar, clickValue, canRebirth } from './game/useGame'
import { useAuth } from './lib/useAuth'
import { usePersistence } from './lib/usePersistence'
import { isConfigured } from './lib/firebase'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StatsPanel from './components/StatsPanel'
import BitCounter from './components/BitCounter'
import ClickTarget from './components/ClickTarget'
import RebirthButton from './components/RebirthButton'
import RebirthModal from './components/RebirthModal'
import RebirthRain from './components/RebirthRain'
import LoginScreen from './components/LoginScreen'
import ProgressStrip from './components/ProgressStrip'
import Logo from './components/Logo'

export default function App() {
  const { state, click, buy, rebirth, load } = useGame()
  const { user, ready, signIn, logOut } = useAuth()
  const { savedAt } = usePersistence({ state, load, user, authReady: ready })

  // Guest choice from the login gate. Cleared on any sign-in so logging out
  // returns the player to the gate.
  const [guestChosen, setGuestChosen] = useState(false)
  useEffect(() => {
    if (user) setGuestChosen(false)
  }, [user])

  // Rebirth flow: 'idle' → 'confirm' (modal) → 'rain' (reset overlay) → 'idle'.
  const [phase, setPhase] = useState('idle')
  const confirmRebirth = useCallback(() => {
    rebirth() // reset happens now, hidden under the rain
    setPhase('rain')
  }, [rebirth])

  // Wait for auth to resolve before deciding gate vs game (avoids a flash).
  if (!ready) {
    return (
      <div className="boot-screen">
        <Logo size="lg" />
      </div>
    )
  }

  // Show the gate once auth is known and the player is neither signed in nor
  // an opted-in guest.
  if (!user && !guestChosen) {
    return (
      <LoginScreen
        onSignIn={signIn}
        onGuest={() => setGuestChosen(true)}
        canSignIn={isConfigured}
      />
    )
  }

  return (
    <div className="app">
      <Header
        rebirthMultiplier={state.rebirthMultiplier}
        savedAt={savedAt}
        user={user}
        onSignIn={signIn}
        onSignOut={logOut}
      />
      <div className="body">
        <main className="play-area">
          <StatsPanel
            lifetimeClicks={state.lifetimeClicks}
            lifetimeBits={state.lifetimeBits}
            rebirths={state.rebirths}
          />
          <BitCounter bits={state.bits} />
          <ClickTarget
            char={currentChar(state)}
            gain={clickValue(state)}
            onClick={click}
          />
          {canRebirth(state) && (
            <RebirthButton onClick={() => setPhase('confirm')} />
          )}
        </main>
        <Sidebar state={state} onBuy={buy} />
      </div>
      <ProgressStrip tier={state.tier} />

      <AnimatePresence>
        {phase === 'confirm' && (
          <RebirthModal
            state={state}
            onConfirm={confirmRebirth}
            onCancel={() => setPhase('idle')}
          />
        )}
      </AnimatePresence>

      {phase === 'rain' && <RebirthRain onDone={() => setPhase('idle')} />}
    </div>
  )
}
