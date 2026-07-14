import { formatNumber } from '../game/format'
import AuthSlot from './AuthSlot'
import SavedIndicator from './SavedIndicator'
import Logo from './Logo'

// Top bar: logo, rebirth multiplier, saved flash, auth control.
export default function Header({
  rebirthMultiplier,
  savedAt,
  user,
  onSignIn,
  onSignOut,
  onOpenLeaderboard,
}) {
  return (
    <header className="header">
      <h1 className="title">
        <Logo size="sm" />
      </h1>
      <div className="header-right">
        {rebirthMultiplier > 1 && (
          <span className="rebirth-badge">
            REBIRTH x{formatNumber(rebirthMultiplier)}
          </span>
        )}
        <button
          type="button"
          className="lb-btn"
          onClick={onOpenLeaderboard}
          aria-label="Leaderboard"
        >
          🏆
        </button>
        <SavedIndicator savedAt={savedAt} />
        <AuthSlot user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
      </div>
    </header>
  )
}
