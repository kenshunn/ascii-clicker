import { formatNumber } from '../game/format'

// Small lifetime-stats panel. These survive rebirth.
export default function StatsPanel({ lifetimeClicks, lifetimeBits, rebirths }) {
  return (
    <div className="stats-panel">
      <Stat label="clicks" value={formatNumber(lifetimeClicks)} />
      <Stat label="bits earned" value={formatNumber(lifetimeBits)} />
      <Stat label="rebirths" value={formatNumber(rebirths)} />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
