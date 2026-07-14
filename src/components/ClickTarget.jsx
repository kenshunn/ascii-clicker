import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { formatNumber } from '../game/format'

// Large central character.
//   - click: scale pop on the button + floating "+N" drift/fade
//   - tier change: inner glyph morphs in with a spring
// Floats are transient UI state (not game state), keyed by a monotonic id so
// rapid clicks never collide/drop. Pop and morph live on separate elements so
// their animations don't fight.
export default function ClickTarget({ char, gain, onClick }) {
  const controls = useAnimationControls()
  const [floats, setFloats] = useState([])
  const nextId = useRef(0)

  const handleClick = useCallback(() => {
    onClick()
    controls.start({ scale: [1, 1.18, 1], transition: { duration: 0.18 } })
    const id = nextId.current++
    setFloats((f) => [...f, { id, amount: gain }])
  }, [onClick, gain, controls])

  const removeFloat = useCallback((id) => {
    setFloats((f) => f.filter((x) => x.id !== id))
  }, [])

  return (
    <div className="click-area">
      <motion.button
        type="button"
        className="click-target"
        onPointerDown={handleClick}
        animate={controls}
        whileTap={{ filter: 'brightness(1.4)' }}
        aria-label={`Click ${char} to earn bits`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={char}
            className="glyph"
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 17 }}
          >
            {char}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <div className="float-layer" aria-hidden="true">
        <AnimatePresence>
          {floats.map((f) => (
            <motion.span
              key={f.id}
              className="float-num"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -80 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              onAnimationComplete={() => removeFloat(f.id)}
            >
              +{formatNumber(gain)}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
