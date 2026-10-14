import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CharacterAvatar from '../components/CharacterAvatar'
import CharacterCard from '../components/CharacterCard'
import NetworkNotice from '../components/NetworkNotice'
import { useFavorites } from '../context/useFavorites'
import { useCharacterDirectory } from '../hooks/useCharacterDirectory'
import { fetchResourceName } from '../services/swapi'
import type { Character } from '../types/character'
import { extractId } from '../utils/character'
import { getSimilarCharacters } from '../utils/recommendations'
import './CharacterDetailPage.css'

type RelatedNameState =
  | { status: 'loading' }
  | { status: 'resolved'; name: string }
  | { status: 'fallback'; label: string }

type CharacterState =
  | { status: 'loading'; id: string | undefined }
  | { status: 'error'; id: string | undefined; message: string }
  | { status: 'success'; id: string | undefined; character: Character }

const characterFields: { key: keyof Character; label: string }[] = [
  { key: 'height', label: 'Height' },
  { key: 'mass', label: 'Mass' },
  { key: 'hair_color', label: 'Hair color' },
  { key: 'skin_color', label: 'Skin color' },
  { key: 'eye_color', label: 'Eye color' },
  { key: 'birth_year', label: 'Birth year' },
  { key: 'gender', label: 'Gender' },
  { key: 'homeworld', label: 'Homeworld' },
  { key: 'films', label: 'Films' },
  { key: 'species', label: 'Species' },
  { key: 'vehicles', label: 'Vehicles' },
  { key: 'starships', label: 'Starships' },
  { key: 'created', label: 'Created' },
  { key: 'edited', label: 'Last updated' },
]

const referenceLabels: Record<string, string> = {
  films: 'Film',
  planets: 'Planet',
  people: 'Character',
  species: 'Species',
  starships: 'Starship',
  vehicles: 'Vehicle',
}

interface ApiReference {
  label: string
  id: string
}

function getApiReference(url: string): ApiReference | null {
  try {
    const parsedUrl = new URL(url)
    const match = parsedUrl.pathname.match(/^\/api\/([^/]+)\/(\d+)\/?$/)
    const resourceType = match?.[1]
    const label = resourceType ? referenceLabels[resourceType] : undefined

    if (parsedUrl.hostname !== 'swapi.info' || !match || !label) {
      return null
    }

    return { label, id: match[2] }
  } catch {
    return null
  }
}

function ReferenceBadge({
  url,
  relatedName,
}: {
  url: string
  relatedName: RelatedNameState | undefined
}) {
  const reference = getApiReference(url)

  if (!reference) {
    return <span className="character-detail__raw-value">{url}</span>
  }

  const label =
    relatedName?.status === 'resolved'
      ? relatedName.name
      : relatedName?.status === 'fallback'
        ? relatedName.label
        : 'Loading name...'

  if (reference.label === 'Film') {
    return (
      <Link
        className="character-detail__badge character-detail__badge--link"
        to={`/film/${reference.id}`}
        title={`View details for ${label}`}
        aria-busy={relatedName?.status === 'loading'}
      >
        {label}
      </Link>
    )
  }

  return (
    <span
      className="character-detail__badge"
      title={url}
      aria-busy={relatedName?.status === 'loading'}
    >
      {label}
    </span>
  )
}

function formatDate(value: string): ReactNode {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return <bdi dir="ltr">{date.toISOString().slice(0, 10)}</bdi>
}

function formatFieldValue(
  key: keyof Character,
  value: string | string[],
  relatedNames: Record<string, RelatedNameState>,
): ReactNode {
  if (Array.isArray(value)) {
    return value.length > 0 ? (
      <span className="character-detail__badges">
        {value.map((url) => (
          <ReferenceBadge
            key={url}
            url={url}
            relatedName={relatedNames[url]}
          />
        ))}
      </span>
    ) : (
      'None listed'
    )
  }

  if (key === 'homeworld') {
    return (
      <span className="character-detail__badges">
        <ReferenceBadge url={value} relatedName={relatedNames[value]} />
      </span>
    )
  }

  if (key === 'height' && /^\d+(?:\.\d+)?$/.test(value)) {
    return `${value} cm`
  }

  if (key === 'mass' && /^\d+(?:\.\d+)?$/.test(value)) {
    return `${value} kg`
  }

  if (key === 'created' || key === 'edited') {
    return formatDate(value)
  }

  return value || 'Unknown'
}

function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { state: directoryState, retry } = useCharacterDirectory()
  const [relatedNames, setRelatedNames] = useState<
    Record<string, RelatedNameState>
  >({})

  const currentCharacter =
    directoryState.status === 'success'
      ? directoryState.characters.find(
          (character) =>
            extractId(character.url) ===
            (id && /^\d+$/.test(id) ? String(Number(id)) : id),
        )
      : undefined
  const currentState: CharacterState =
    directoryState.status === 'loading'
      ? { status: 'loading', id }
      : directoryState.status === 'error'
        ? { status: 'error', id, message: directoryState.message }
        : currentCharacter
          ? { status: 'success', id, character: currentCharacter }
          : {
              status: 'error',
              id,
              message: `Character ${id ?? ''} was not found in the character list.`,
            }
  const loadedCharacter =
    currentState.status === 'success' ? currentState.character : undefined
  const characterIds =
    directoryState.status === 'success'
      ? directoryState.characters
          .map((character) => extractId(character.url))
          .filter(Boolean)
      : []
  const requestedCharacterId =
    id && /^\d+$/.test(id) ? String(Number(id)) : id ?? ''
  const currentIndex = characterIds.indexOf(requestedCharacterId)
  const characterOrder = {
    previousId: currentIndex > 0 ? characterIds[currentIndex - 1] : null,
    nextId:
      currentIndex >= 0 && currentIndex < characterIds.length - 1
        ? characterIds[currentIndex + 1]
        : null,
  }
  const similarCharacters =
    currentState.status === 'success' &&
    directoryState.status === 'success'
      ? getSimilarCharacters(
          currentState.character,
          directoryState.characters,
          4,
        )
      : []

  useEffect(() => {
    if (!loadedCharacter) {
      return
    }

    const controller = new AbortController()
    const resourceUrls = [
      loadedCharacter.homeworld,
      ...loadedCharacter.films,
      ...loadedCharacter.species,
      ...loadedCharacter.vehicles,
      ...loadedCharacter.starships,
    ]
    const uniqueResourceUrls = [...new Set(resourceUrls)]

    async function loadRelatedNames() {
      const resolvedNames = await Promise.all(
        uniqueResourceUrls.map(async (url) => {
          try {
            const name = await fetchResourceName(url, controller.signal)
            return [url, { status: 'resolved', name }] as const
          } catch {
            const reference = getApiReference(url)
            return [
              url,
              {
                status: 'fallback',
                label: reference
                  ? `${reference.label} #${reference.id}`
                  : url,
              },
            ] as const
          }
        }),
      )

      if (!controller.signal.aborted) {
        setRelatedNames(Object.fromEntries(resolvedNames))
      }
    }

    void loadRelatedNames()

    return () => controller.abort()
  }, [loadedCharacter])

  useEffect(() => {
    function handleCharacterShortcut(event: KeyboardEvent) {
      const target = event.target
      const isInteractive =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.matches('input, textarea, select, button, a'))

      if (
        isInteractive ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return
      }

      if (event.key === 'ArrowLeft' && characterOrder.previousId) {
        event.preventDefault()
        navigate(`/character/${characterOrder.previousId}`)
      } else if (event.key === 'ArrowRight' && characterOrder.nextId) {
        event.preventDefault()
        navigate(`/character/${characterOrder.nextId}`)
      }
    }

    window.addEventListener('keydown', handleCharacterShortcut)
    return () => window.removeEventListener('keydown', handleCharacterShortcut)
  }, [characterOrder.nextId, characterOrder.previousId, navigate])

  const routeCharacterId = id && /^\d+$/.test(id) ? id : undefined
  const urlCharacterId =
    currentState.status === 'success'
      ? extractId(currentState.character.url)
      : undefined
  const characterId =
    urlCharacterId && /^\d+$/.test(urlCharacterId)
      ? urlCharacterId
      : routeCharacterId ?? ''

  return (
    <section className="character-detail">
      <Link className="character-detail__back" to="/">
        Back to List
      </Link>
      {currentState.status === 'loading' && (
        <p className="character-detail__message" role="status">
          Loading character details...
        </p>
      )}
      {currentState.status === 'error' && (
        <NetworkNotice
          message={`Error: ${currentState.message}`}
          onRetry={retry}
        />
      )}
      {currentState.status === 'success' && (
        <article>
          {directoryState.status === 'success' &&
            directoryState.networkError && (
              <NetworkNotice
                message={directoryState.networkError}
                onRetry={retry}
                savedData={directoryState.source === 'cache'}
              />
            )}
          {directoryState.status === 'success' &&
            directoryState.cacheWarning && (
              <p role="status">{directoryState.cacheWarning}</p>
            )}
          <div className="character-detail__header">
            <div className="character-detail__identity">
              <CharacterAvatar
                key={currentState.character.url}
                characterId={characterId}
                characterName={currentState.character.name}
                size="portrait"
              />
              <h1 className="character-detail__title">
                {currentState.character.name}
              </h1>
            </div>
            <button
              className="character-detail__favorite"
              type="button"
              aria-pressed={isFavorite(currentState.character)}
              aria-label={
                isFavorite(currentState.character)
                  ? `Remove ${currentState.character.name} from favorites`
                  : `Add ${currentState.character.name} to favorites`
              }
              onClick={() => toggleFavorite(currentState.character)}
            >
              {isFavorite(currentState.character)
                ? '★ Remove from Favorites'
                : '☆ Add to Favorites'}
            </button>
          </div>
          <nav
            className="character-detail__pagination"
            aria-label="Character navigation"
          >
            <button
              type="button"
              disabled={!characterOrder.previousId}
              aria-label="Previous character"
              onClick={() =>
                characterOrder.previousId &&
                navigate(`/character/${characterOrder.previousId}`)
              }
            >
              <span aria-hidden="true">←</span>
              Previous
            </button>
            <button
              type="button"
              disabled={!characterOrder.nextId}
              aria-label="Next character"
              onClick={() =>
                characterOrder.nextId &&
                navigate(`/character/${characterOrder.nextId}`)
              }
            >
              Next
              <span aria-hidden="true">→</span>
            </button>
          </nav>
          <p className="character-detail__keyboard-tip">
            Use <kbd>←</kbd> and <kbd>→</kbd> to browse characters
          </p>
          <dl className="character-detail__fields">
            {characterFields.map(({ key, label }) => {
              return (
                <div className="character-detail__field" key={key}>
                  <dt>{label}</dt>
                  <dd>
                    {formatFieldValue(
                      key,
                      currentState.character[key],
                      relatedNames,
                    )}
                  </dd>
                </div>
              )
            })}
          </dl>
          {similarCharacters.length > 0 && (
            <section
              className="character-detail__similar"
              aria-labelledby="similar-characters-title"
            >
              <h2 id="similar-characters-title">Similar characters</h2>
              <p className="character-detail__similar-description">
                Based on shared films, species, and homeworld.
              </p>
              <div className="character-grid">
                {similarCharacters.map(({ character, reasons }) => (
                  <div className="character-detail__similar-card" key={character.url}>
                    <CharacterCard character={character} />
                    <p>{reasons.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      )}
    </section>
  )
}

export default CharacterDetailPage
