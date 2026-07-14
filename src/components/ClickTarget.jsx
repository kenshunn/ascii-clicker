import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'

// Large central character. Each click: scale pop on the glyph + a floating
// "+N" that drifts up and fades. Floats are transient UI state (not game
// state), keyed by a monotonic id so rapid clicks never collide/drop.
export default function ClickTarget({ char, gain, onClick }) {
  const controls = useAnimationControls()
  const [floats, setFloats] = useState([])
  const nextId = useRef(0)

  const handleClick = useCallback(() => {
    onClick()
    // replay the pop from the start on every click, even mid-animation
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
        {char}
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
              +{f.amount}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
