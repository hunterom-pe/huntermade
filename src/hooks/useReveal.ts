import { useEffect } from 'react'

/**
 * Marks every [data-reveal] element as revealed once it scrolls into view.
 * Call once near the app root. Elements stay revealed (no re-hiding).
 * CSS in styles/motion.css only hides them when motion is allowed,
 * so content is always visible without JS or with reduced motion.
 */
export function useReveal(rootMargin = '0px 0px -10% 0px') {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])')
    if (!items.length) return

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => (el.dataset.revealed = 'true'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ;(entry.target as HTMLElement).dataset.revealed = 'true'
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin },
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rootMargin])
}
