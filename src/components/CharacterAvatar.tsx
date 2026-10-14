import { useState } from 'react'
import './CharacterAvatar.css'

interface CharacterAvatarProps {
  characterId: string
  characterName: string
  size: 'thumbnail' | 'portrait'
}

function CharacterAvatar({
  characterId,
  characterName,
  size,
}: CharacterAvatarProps) {
  const encodedName = encodeURIComponent(characterName)
  const isValidCharacterId = /^\d+$/.test(characterId)
  const primaryImageSource = isValidCharacterId
    ? `https://raw.githubusercontent.com/akabab/starwars-api/master/api/images/id/${characterId}.jpg`
    : null
  const fallbackImageSource = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodedName}`
  const [imgError, setImgError] = useState(false)
  const [fallbackError, setFallbackError] = useState(false)
  const className = `character-avatar character-avatar--${size}`

  if (fallbackError) {
    return (
      <span
        className={`${className} character-avatar--placeholder`}
        role="img"
        aria-label={`${characterName} avatar placeholder`}
      >
        <svg
          className="character-avatar__icon"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <circle cx="24" cy="16" r="9" />
          <path d="M7 44c0-9.4 7.6-17 17-17s17 7.6 17 17H7Z" />
        </svg>
      </span>
    )
  }

  const imageSource = imgError || primaryImageSource === null
    ? fallbackImageSource
    : primaryImageSource

  return (
    <img
      className={className}
      src={imageSource}
      alt={characterName}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!imgError && primaryImageSource !== null) {
          setImgError(true)
        } else {
          setFallbackError(true)
        }
      }}
    />
  )
}

export default CharacterAvatar
