import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchCharacter } from '../services/swapi'
import type { Character } from '../types/character'
import './CharacterDetailPage.css'

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
  { key: 'url', label: 'API URL' },
]

function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [state, setState] = useState<CharacterState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    const parsedId = id && /^\d+$/.test(id) ? Number(id) : Number.NaN

    async function loadCharacter() {
      try {
        const character = await fetchCharacter(parsedId, controller.signal)
        setState({ status: 'success', character })
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
          <h1 className="character-detail__title">{state.character.name}</h1>
          <dl className="character-detail__fields">
            {characterFields.map(({ key, label }) => {
              const value = state.character[key]
              const displayValue = Array.isArray(value)
                ? value.join(', ')
                : value

              return (
                <div className="character-detail__field" key={key}>
                  <dt>{label}</dt>
                  <dd>{displayValue || 'Unknown'}</dd>
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
