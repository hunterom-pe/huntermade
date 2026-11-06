import type { Shot } from '../../data/projects'

type FrameProps = {
  shot: Shot
  sizes: string
  className?: string
}

/** Minimal browser chrome around a website screenshot. */
export function BrowserFrame({ shot, sizes, url, className = '' }: FrameProps & { url: string }) {
  return (
    <div className={`browser-frame ${className}`.trim()}>
      <div className="browser-frame__bar" aria-hidden="true">
        <span className="browser-frame__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="browser-frame__url">{url}</span>
      </div>
      <img
        srcSet={shot.srcSet}
        sizes={sizes}
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

/** Simple phone silhouette around an app screenshot. */
export function PhoneFrame({ shot, sizes, className = '' }: FrameProps) {
  return (
    <div className={`phone-frame ${className}`.trim()}>
      <img
        srcSet={shot.srcSet}
        sizes={sizes}
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
