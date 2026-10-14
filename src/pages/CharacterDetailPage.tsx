import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CharacterAvatar from '../components/CharacterAvatar'
import { useFavorites } from '../context/useFavorites'
import {
  fetchCharacter,
  fetchCharacters,
  fetchResourceName,
} from '../services/swapi'
import type { Character } from '../types/character'
import { extractId, getCharacterId } from '../utils/character'
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
  const [state, setState] = useState<CharacterState>({
    status: 'loading',
    id,
  })
  const [characterOrder, setCharacterOrder] = useState<{
    previousId: string | null
    nextId: string | null
  }>({ previousId: null, nextId: null })
  const [relatedNames, setRelatedNames] = useState<
    Record<string, RelatedNameState>
  >({})

  useEffect(() => {
    const controller = new AbortController()
    const parsedId = id && /^\d+$/.test(id) ? Number(id) : Number.NaN

    async function loadCharacter() {
      try {
        const [character, characters] = await Promise.all([
          fetchCharacter(parsedId, controller.signal),
          fetchCharacters(controller.signal),
        ])
        setState({ status: 'success', id, character })

        const characterIds = characters.map((item) =>
          getCharacterId(item.url),
        )
        const currentIndex = characterIds.indexOf(String(parsedId))

        setCharacterOrder({
          previousId:
            currentIndex > 0 ? characterIds[currentIndex - 1] : null,
          nextId:
            currentIndex >= 0 && currentIndex < characterIds.length - 1
              ? characterIds[currentIndex + 1]
              : null,
        })

        const resourceUrls = [
          character.homeworld,
          ...character.films,
          ...character.species,
          ...character.vehicles,
          ...character.starships,
        ]
        const uniqueResourceUrls = [...new Set(resourceUrls)]

        setRelatedNames(
          Object.fromEntries(
            uniqueResourceUrls.map((url) => [
              url,
              { status: 'loading' as const },
            ]),
          ),
        )

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
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'An unexpected error occurred'
        setState({ status: 'error', id, message })
      }
    }

    void loadCharacter()

    return () => controller.abort()
  }, [id])

  const currentState: CharacterState =
    state.id === id ? state : { status: 'loading', id }
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
        <p className="character-detail__message" role="alert">
          Error: {currentState.message}
        </p>
      )}
      {currentState.status === 'success' && (
        <article>
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
              onClick={() =>
                characterOrder.previousId &&
                navigate(`/character/${characterOrder.previousId}`)
              }
            >
              ← Previous Character
            </button>
            <button
              type="button"
              disabled={!characterOrder.nextId}
              onClick={() =>
                characterOrder.nextId &&
                navigate(`/character/${characterOrder.nextId}`)
              }
            >
              Next Character →
            </button>
          </nav>
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
        </article>
      )}
    </section>
  )
}

export default CharacterDetailPage
