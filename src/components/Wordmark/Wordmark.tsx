import './Wordmark.css'

type WordmarkProps = {
  /** nav = compact header lockup, poster = oversized hero lockup */
  size?: 'nav' | 'poster'
  /** Use 'onOrange' when placed on an orange surface — the square turns ink */
  tone?: 'default' | 'onOrange' | 'onInk'
  className?: string
}

/**
 * HUNTER / MADE. — stacked condensed wordmark.
 * The full stop is the brand's orange square.
 * Purely typographic; screen readers get "Hunter Made".
 */
export function Wordmark({ size = 'nav', tone = 'default', className = '' }: WordmarkProps) {
  return (
    <span
      className={`wordmark wordmark--${size} wordmark--${tone} ${className}`.trim()}
      role="img"
      aria-label="Hunter Made"
    >
      <span className="wordmark__line" aria-hidden="true">
        Hunter
      </span>{' '}
      {/* the space keeps the text "Hunter Made" (not "HunterMade") for name-matching */}
      <span className="wordmark__line" aria-hidden="true">
        Made<span className="wordmark__dot" />
      </span>
    </span>
  )
}
