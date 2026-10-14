import { useState } from 'react'
import { getFilmPosterUrl } from '../services/filmArtwork'
import './FilmArtwork.css'

interface FilmArtworkProps {
  filmId: string
  filmTitle: string
  size: 'thumbnail' | 'poster'
}

function FilmArtwork({ filmId, filmTitle, size }: FilmArtworkProps) {
  const [failed, setFailed] = useState(false)
  const imageUrl = getFilmPosterUrl(filmId)
  const className = `film-artwork film-artwork--${size}`

  if (!imageUrl || failed) {
    return (
      <span
        className={`${className} film-artwork--placeholder`}
        role="img"
        aria-label={`${filmTitle} poster unavailable`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8" cy="8" r="1.5" />
          <path d="m4 18 5-5 3 3 3-4 5 6" />
        </svg>
      </span>
    )
  }

  return (
    <img
      className={className}
      src={imageUrl}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

export default FilmArtwork
