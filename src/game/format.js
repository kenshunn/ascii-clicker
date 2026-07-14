// Number display: suffix notation (1.2K, 3.4M ...); scientific past 1e15.
const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi']

export function formatNumber(n) {
  if (n < 1000) return String(Math.floor(n))
  if (n >= 1e15) return n.toExponential(2)

  const tier = Math.floor(Math.log10(n) / 3)
  const scaled = n / Math.pow(1000, tier)
  return `${trim(scaled)}${SUFFIXES[tier]}`
}

// One decimal, but drop a trailing ".0".
function trim(x) {
  const s = x.toFixed(1)
  return s.endsWith('.0') ? s.slice(0, -2) : s
}
