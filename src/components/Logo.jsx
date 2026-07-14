import { motion } from 'framer-motion'

// ASCII wordmark: a terminal prompt, the name, and a blinking block cursor.
// `size` is 'sm' (header) or 'lg' (login screen).
export default function Logo({ size = 'sm' }) {
  return (
    <span className={`logo logo-${size}`}>
      <span className="logo-prompt">~$</span>
      <span className="logo-word">ascii</span>
      <span className="logo-word logo-accent">clicker</span>
      <motion.span
        className="logo-cursor"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
          times: [0, 0.5, 0.5, 1],
        }}
      >
        █
      </motion.span>
    </span>
  )
}
