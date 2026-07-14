import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Tiny "saved" flash. `savedAt` is a timestamp that changes on each write; we
// show the indicator briefly whenever it changes.
export default function SavedIndicator({ savedAt }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!savedAt) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 1500)
    return () => clearTimeout(t)
  }, [savedAt])

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          className="saved-indicator"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          ✓ saved
        </motion.span>
      )}
    </AnimatePresence>
  )
}
