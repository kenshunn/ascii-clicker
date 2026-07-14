import { formatNumber } from '../game/format'
import AuthSlot from './AuthSlot'
import SavedIndicator from './SavedIndicator'

// Top bar: title, rebirth multiplier, saved flash, auth control.
export default function Header({ rebirthMultiplier, savedAt, user, onSignIn, onSignOut }) {
  return (
    <header className="header">
      <h1 className="title">ASCII CLICKER</h1>
      <div className="header-right">
        {rebirthMultiplier > 1 && (
          <span className="rebirth-badge">
            REBIRTH x{formatNumber(rebirthMultiplier)}
          </span>
        )}
        <SavedIndicator savedAt={savedAt} />
        <AuthSlot user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
      </div>
    </header>
  )
}
