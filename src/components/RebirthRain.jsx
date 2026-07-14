import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FIRST_CHAR_CODE, LAST_CHAR_CODE } from '../game/constants'

const DROP_COUNT = 90
const DURATION = 1.5 // seconds — matches spec's ~1.5s

// Full-screen rain of random ASCII glyphs during the reset. Fires onDone
// after DURATION so the parent can land on the fresh run.
export default function RebirthRain({ onDone }) {
  const drops = useMemo(() => makeDrops(), [])

  useEffect(() => {
    const t = setTimeout(onDone, DURATION * 1000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="rain" aria-hidden="true">
      {drops.map((d) => (
        <motion.span
          key={d.id}
          className="rain-drop"
          style={{ left: `${d.left}%`, fontSize: `${d.size}rem` }}
          initial={{ y: '-15vh', opacity: 0 }}
          animate={{ y: '115vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: d.dur, delay: d.delay, ease: 'linear' }}
        >
          {d.glyph}
        </motion.span>
      ))}
    </div>
  )
}

function makeDrops() {
  const range = LAST_CHAR_CODE - FIRST_CHAR_CODE + 1
  return Array.from({ length: DROP_COUNT }, (_, id) => ({
    id,
    glyph: String.fromCharCode(FIRST_CHAR_CODE + Math.floor(Math.random() * range)),
    left: Math.random() * 100,
    size: 0.9 + Math.random() * 1.6,
    dur: 0.9 + Math.random() * 0.6,
    delay: Math.random() * 0.5,
  }))
}
