import { upcomingTiers, nextTier } from '../game/useGame'
import { formatNumber, formatMult } from '../game/format'

// Right rail: the next 5 upcoming characters. Only the very next tier is
// buyable; the rest render locked/dimmed.
export default function Sidebar({ state, onBuy }) {
  const upcoming = upcomingTiers(state, 5)
  const next = nextTier(state)

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">UPGRADES</h2>

      {upcoming.length === 0 && (
        <p className="sidebar-empty">// max tier owned</p>
      )}

      <ul className="tier-list">
        {upcoming.map((tier) => {
          const isNext = tier.index === next?.index
          const affordable = isNext && state.bits >= tier.cost
          return (
            <li
              key={tier.code}
              className={`tier-row ${isNext ? 'is-next' : 'is-locked'}`}
            >
              <span className="tier-glyph">{tier.glyph}</span>
              <div className="tier-meta">
                <span className="tier-code">#{tier.code}</span>
                <span className="tier-mult">{formatMult(tier.multiplier)}</span>
                <span className="tier-cost">{formatNumber(tier.cost)} bits</span>
              </div>
              {isNext ? (
                <button
                  type="button"
                  className="buy-btn"
                  onClick={onBuy}
                  disabled={!affordable}
                >
                  BUY
                </button>
              ) : (
                <span className="lock-icon" aria-hidden="true">🔒</span>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
