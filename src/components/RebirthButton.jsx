import { motion } from 'framer-motion'

// Appears once '~' is owned. Subtle glow/pulse to draw attention.
export default function RebirthButton({ onClick }) {
  return (
    <motion.button
      type="button"
      className="rebirth-btn"
      onClick={onClick}
      animate={{
        boxShadow: [
          '0 0 0px rgba(57,255,20,0.0)',
          '0 0 28px rgba(57,255,20,0.7)',
          '0 0 0px rgba(57,255,20,0.0)',
        ],
        scale: [1, 1.04, 1],
      }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
    >
      ↺ REBIRTH
    </motion.button>
  )
}
