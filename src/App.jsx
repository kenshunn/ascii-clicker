import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGame, currentChar, clickValue, canRebirth } from './game/useGame'
import { useAuth } from './lib/useAuth'
import { usePersistence } from './lib/usePersistence'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StatsPanel from './components/StatsPanel'
import BitCounter from './components/BitCounter'
import ClickTarget from './components/ClickTarget'
import RebirthButton from './components/RebirthButton'
import RebirthModal from './components/RebirthModal'
import RebirthRain from './components/RebirthRain'
import ConflictModal from './components/ConflictModal'
import ProgressStrip from './components/ProgressStrip'

export default function App() {
  const { state, click, buy, rebirth, load } = useGame()
  const { user, ready, signIn, logOut } = useAuth()
  const { savedAt, conflict, resolveConflict } = usePersistence({
    state,
    load,
    user,
    authReady: ready,
  })

  // Rebirth flow: 'idle' → 'confirm' (modal) → 'rain' (reset overlay) → 'idle'.
  const [phase, setPhase] = useState('idle')

  const confirmRebirth = useCallback(() => {
    rebirth() // reset happens now, hidden under the rain
    setPhase('rain')
  }, [rebirth])

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
        {conflict && (
          <ConflictModal conflict={conflict} onResolve={resolveConflict} />
        )}
      </AnimatePresence>

      {phase === 'rain' && <RebirthRain onDone={() => setPhase('idle')} />}
    </div>
  )
}
