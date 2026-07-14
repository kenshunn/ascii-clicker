import { motion } from 'framer-motion'
import { formatNumber } from '../game/format'

// Shown on login when the local guest save is ahead of the cloud save.
// Player picks which to keep.
export default function ConflictModal({ conflict, onResolve }) {
  const { local, cloud } = conflict

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        <h2 className="modal-title">Two saves found</h2>
        <p className="conflict-lead">
          Your guest progress is ahead of your cloud save. Keep which one?
        </p>

        <div className="modal-cols">
          <button
            type="button"
            className="save-choice"
            onClick={() => onResolve('local')}
          >
            <h3>This device</h3>
            <span>{formatNumber(local.lifetimeBits)} bits earned</span>
          </button>
          <button
            type="button"
            className="save-choice"
            onClick={() => onResolve('cloud')}
          >
            <h3>Cloud</h3>
            <span>{formatNumber(cloud.lifetimeBits)} bits earned</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
