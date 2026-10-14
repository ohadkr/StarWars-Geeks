import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFavorites } from '../context/useFavorites'
import { fetchCharacter, fetchResourceName } from '../services/swapi'
import type { Character } from '../types/character'
import './CharacterDetailPage.css'

type RelatedNameState =
  | { status: 'loading' }
  | { status: 'resolved'; name: string }
  | { status: 'fallback'; label: string }

type CharacterState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; character: Character }

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

function formatReference(url: string): string | null {
  try {
    const parsedUrl = new URL(url)
    const match = parsedUrl.pathname.match(/^\/api\/([^/]+)\/(\d+)\/?$/)
    const label = match ? referenceLabels[match[1]] : undefined

    if (parsedUrl.hostname !== 'swapi.info' || !match || !label) {
      return null
    }

    return `${label} #${match[2]}`
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
  const fallbackLabel = formatReference(url)

  if (!fallbackLabel) {
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

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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
  const { isFavorite, toggleFavorite } = useFavorites()
  const [state, setState] = useState<CharacterState>({ status: 'loading' })
  const [relatedNames, setRelatedNames] = useState<
    Record<string, RelatedNameState>
  >({})

  useEffect(() => {
    const controller = new AbortController()
    const parsedId = id && /^\d+$/.test(id) ? Number(id) : Number.NaN

    async function loadCharacter() {
      try {
        const character = await fetchCharacter(parsedId, controller.signal)
        setState({ status: 'success', character })

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
              return [
                url,
                { status: 'fallback', label: formatReference(url) ?? url },
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
        setState({ status: 'error', message })
      }
    }

    void loadCharacter()

    return () => controller.abort()
  }, [id])

  return (
    <section className="character-detail">
      <Link className="character-detail__back" to="/">
        Back to List
      </Link>
      {state.status === 'loading' && (
        <p className="character-detail__message" role="status">
          Loading character details...
        </p>
      )}
      {state.status === 'error' && (
        <p className="character-detail__message" role="alert">
          Error: {state.message}
        </p>
      )}
      {state.status === 'success' && (
        <article>
          <div className="character-detail__header">
            <h1 className="character-detail__title">{state.character.name}</h1>
            <button
              className="character-detail__favorite"
              type="button"
              aria-pressed={isFavorite(state.character)}
              aria-label={
                isFavorite(state.character)
                  ? `Remove ${state.character.name} from favorites`
                  : `Add ${state.character.name} to favorites`
              }
              onClick={() => toggleFavorite(state.character)}
            >
              {isFavorite(state.character)
                ? '★ Remove from Favorites'
                : '☆ Add to Favorites'}
            </button>
          </div>
          <dl className="character-detail__fields">
            {characterFields.map(({ key, label }) => {
              return (
                <div className="character-detail__field" key={key}>
                  <dt>{label}</dt>
                  <dd>
                    {formatFieldValue(
                      key,
                      state.character[key],
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
