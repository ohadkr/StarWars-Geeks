import { useEffect, useState } from 'react'
import {
  fetchCharacterImage,
  fetchFallbackCharacterImage,
} from '../services/characterImages'
import './CharacterAvatar.css'

interface CharacterAvatarProps {
  characterName: string
  size: 'thumbnail' | 'portrait'
}

interface PortraitState {
  characterName: string
  imageUrl: string | null
  usingFallback: boolean
  failed: boolean
}

function CharacterAvatar({
  characterName,
  size,
}: CharacterAvatarProps) {
  const [portrait, setPortrait] = useState<PortraitState>({
    characterName,
    imageUrl: null,
    usingFallback: false,
    failed: false,
  })
  const className = `character-avatar character-avatar--${size}`

  useEffect(() => {
    let isCurrent = true

    fetchCharacterImage(characterName)
      .then((imageUrl) => {
        if (isCurrent) {
          setPortrait({
            characterName,
            imageUrl,
            usingFallback: false,
            failed: imageUrl === null,
          })
        }
      })
      .catch(() => {
        if (!isCurrent) {
          return
        }

        fetchFallbackCharacterImage(characterName)
          .then((fallbackImageUrl) => {
            if (isCurrent) {
              setPortrait({
                characterName,
                imageUrl: fallbackImageUrl,
                usingFallback: true,
                failed: fallbackImageUrl === null,
              })
            }
          })
          .catch(() => {
            if (isCurrent) {
              setPortrait({
                characterName,
                imageUrl: null,
                usingFallback: true,
                failed: true,
              })
            }
          })
      })

    return () => {
      isCurrent = false
    }
  }, [characterName])

  const portraitIsCurrent = portrait.characterName === characterName
  const imageUrl = portraitIsCurrent ? portrait.imageUrl : null
  const portraitFailed = portraitIsCurrent && portrait.failed

  function handleImageError() {
    if (portrait.usingFallback) {
      setPortrait((current) =>
        current.characterName === characterName
          ? { ...current, failed: true }
          : current,
      )
      return
    }

    setPortrait((current) =>
      current.characterName === characterName
        ? { ...current, usingFallback: true }
        : current,
    )
    fetchFallbackCharacterImage(characterName)
      .then((fallbackImageUrl) => {
        setPortrait((current) =>
          current.characterName === characterName
            ? {
                characterName,
                imageUrl: fallbackImageUrl,
                usingFallback: true,
                failed: fallbackImageUrl === null,
              }
            : current,
        )
      })
      .catch(() => {
        setPortrait((current) =>
          current.characterName === characterName
            ? { ...current, failed: true }
            : current,
        )
      })
  }

  if (imageUrl === null || portraitFailed) {
    return (
      <span
        className={`${className} character-avatar--placeholder`}
        role="img"
        aria-label={
          portraitFailed
            ? `${characterName} portrait unavailable`
            : `Loading ${characterName} portrait`
        }
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

  return (
    <img
      className={className}
      src={imageUrl}
      alt={characterName}
      referrerPolicy="no-referrer"
      onError={handleImageError}
    />
  )
}

export default CharacterAvatar
