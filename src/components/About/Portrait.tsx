import './Portrait.css'

type PortraitProps = {
  /**
   * Path/URL of the real portrait. When null, a designed graphic placeholder
   * is shown (no "coming soon" text). See README → "Replacing the portrait".
   */
  src: string | null
  alt?: string
}

/** 4:5 editorial portrait frame with black-and-white treatment and orange geometry. */
export function Portrait({ src, alt = 'Portrait of Hunter Ortega-Mathews' }: PortraitProps) {
  return (
    <figure className={`portrait${src ? ' portrait--photo' : ''}`}>
      <div className="portrait__frame">
        {src ? (
          <img className="portrait__img" src={src} alt={alt} width={800} height={1000} loading="lazy" decoding="async" />
        ) : (
          <div className="portrait__placeholder" aria-hidden="true">
            <span className="portrait__monogram">HM</span>
          </div>
        )}
        <span className="portrait__grid" aria-hidden="true" />
      </div>
      <span className="portrait__block portrait__block--a" aria-hidden="true" />
      <span className="portrait__block portrait__block--b" aria-hidden="true" />
      <figcaption className="portrait__caption label">Hunter Ortega-Mathews / Phoenix, AZ</figcaption>
    </figure>
  )
}
