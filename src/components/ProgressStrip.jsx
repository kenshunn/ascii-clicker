import { motion } from 'framer-motion'
import { CHARACTERS } from '../game/constants'

// Bottom strip: every glyph, tiny. Owned lit, current pulsing, locked faint.
// Pulse is framer-motion (no CSS keyframes).
export default function ProgressStrip({ tier }) {
  return (
    <div className="progress-strip">
      {CHARACTERS.map((c) => {
        const state = c.index < tier ? 'owned' : c.index === tier ? 'current' : 'locked'
        if (state === 'current') {
          return (
            <motion.span
              key={c.code}
              className="pip pip-current"
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.35, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              {c.glyph}
            </motion.span>
          )
        }
        return (
          <span key={c.code} className={`pip pip-${state}`}>
            {c.glyph}
          </span>
        )
      })}
    </div>
  )
}
