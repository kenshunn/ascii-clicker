import { formatNumber } from '../game/format'

// Big Bits readout above the click target.
export default function BitCounter({ bits }) {
  return (
    <div className="bit-counter">
      <span className="bit-value">{formatNumber(bits)}</span>
      <span className="bit-label">BITS</span>
    </div>
  )
}
