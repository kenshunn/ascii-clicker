import { motion } from 'framer-motion'
import { REBIRTH_BASE } from '../game/constants'
import { formatNumber } from '../game/format'

// Confirmation dialog: exactly what is kept vs lost. Parent gates mount via
// AnimatePresence so enter/exit animate.
export default function RebirthModal({ state, onConfirm, onCancel }) {
  const nextMult = REBIRTH_BASE ** (state.rebirths + 1)

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Rebirth?</h2>

        <div className="modal-cols">
          <div className="keep">
            <h3>Kept</h3>
            <ul>
              <li>Lifetime clicks & bits earned</li>
              <li>Rebirth count</li>
              <li>
                Permanent multiplier → <b>x{formatNumber(nextMult)}</b>
              </li>
            </ul>
          </div>
          <div className="lose">
            <h3>Lost</h3>
            <ul>
              <li>All {formatNumber(state.bits)} current bits</li>
              <li>All tier progress (back to '!')</li>
            </ul>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            Rebirth
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
