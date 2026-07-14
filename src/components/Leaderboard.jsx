import { motion } from 'framer-motion'
import { formatNumber } from '../game/format'

// Top players by lifetime Bits earned. Read-only, public.
export default function Leaderboard({ entries, loading, error, currentUid, onClose }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal leaderboard-modal"
        role="dialog"
        aria-modal="true"
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lb-head">
          <h2 className="modal-title">🏆 Leaderboard</h2>
          <button type="button" className="lb-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {loading && <p className="lb-msg">Loading…</p>}
        {error && <p className="lb-msg">Could not load leaderboard.</p>}
        {!loading && !error && entries.length === 0 && (
          <p className="lb-msg">No players yet — be the first.</p>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className="lb-table-wrap">
            <table className="lb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Bits earned</th>
                  <th>Clicks</th>
                  <th>Rebirths</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.uid} className={e.uid === currentUid ? 'lb-you' : ''}>
                    <td>{i + 1}</td>
                    <td className="lb-name">
                      {e.name || 'Anonymous'}
                      {e.uid === currentUid && <span className="lb-badge">you</span>}
                    </td>
                    <td>{formatNumber(e.lifetimeBits || 0)}</td>
                    <td>{formatNumber(e.lifetimeClicks || 0)}</td>
                    <td>{formatNumber(e.rebirths || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
