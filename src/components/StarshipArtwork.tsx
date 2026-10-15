import { useState } from 'react'
import './StarshipArtwork.css'

interface StarshipArtworkProps {
  starshipId: string
  starshipName: string
  size: 'thumbnail' | 'card' | 'full'
}

function StarshipArtwork({
  starshipId,
  starshipName,
  size,
}: StarshipArtworkProps) {
  const [failed, setFailed] = useState(false)
  const className = `starship-artwork starship-artwork--${size}`

  if (failed || !/^\d+$/.test(starshipId)) {
    return (
      <span
        className={`${className} starship-artwork--placeholder`}
        role="img"
        aria-label={`${starshipName} image unavailable`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 14 12 4l10 10-10 6-10-6Zm10-10v16M2 14h20" />
        </svg>
      </span>
    )
  }

  return (
    <img
      className={className}
      src={`https://starwars-visualguide.com/assets/img/starships/${starshipId}.jpg`}
      alt={size === 'thumbnail' ? '' : starshipName}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

export default StarshipArtwork
