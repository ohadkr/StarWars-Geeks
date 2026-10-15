import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NetworkNotice from '../components/NetworkNotice'
import StarshipArtwork from '../components/StarshipArtwork'
import { fetchStarship, type Starship } from '../services/swapi'
import './StarshipDetailPage.css'

type StarshipState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; starship: Starship }

function StarshipDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{
    id: string | undefined
    attempt: number
    state: StarshipState
  }>({ id, attempt: 0, state: { status: 'loading' } })

  useEffect(() => {
    const controller = new AbortController()
    const starshipId = id && /^\d+$/.test(id) ? Number(id) : Number.NaN

    async function loadStarship() {
      try {
        const starship = await fetchStarship(starshipId, controller.signal)
        setResult({ id, attempt, state: { status: 'success', starship } })
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return
        }
        const message =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        setResult({ id, attempt, state: { status: 'error', message } })
      }
    }

    void loadStarship()
    return () => controller.abort()
  }, [attempt, id])

  const state =
    result.id === id && result.attempt === attempt
      ? result.state
      : ({ status: 'loading' } as const)
  const starshipId = id && /^\d+$/.test(id) ? String(Number(id)) : ''

  return (
    <section className="starship-detail">
      <Link className="starship-detail__back" to="/starships">
        Back to Starships
      </Link>
      {state.status === 'loading' && (
        <p role="status">Loading starship details...</p>
      )}
      {state.status === 'error' && (
        <NetworkNotice
          message={`Starship details could not be loaded: ${state.message}`}
          onRetry={() => setAttempt((current) => current + 1)}
        />
      )}
      {state.status === 'success' && (
        <article className="starship-detail__content">
          <header className="starship-detail__header">
            <p className="starship-detail__eyebrow">Starship dossier</p>
            <h1>{state.starship.name}</h1>
            <p>{state.starship.model}</p>
          </header>
          <StarshipArtwork
            starshipId={starshipId}
            starshipName={state.starship.name}
            size="full"
          />
          <dl className="starship-detail__specs">
            <div>
              <dt>Model</dt>
              <dd>{state.starship.model}</dd>
            </div>
            <div>
              <dt>Manufacturer</dt>
              <dd>{state.starship.manufacturer}</dd>
            </div>
            <div>
              <dt>Cost in credits</dt>
              <dd>{state.starship.cost_in_credits}</dd>
            </div>
            <div>
              <dt>Maximum speed</dt>
              <dd>{state.starship.max_atmosphering_speed}</dd>
            </div>
            <div>
              <dt>Hyperdrive rating</dt>
              <dd>{state.starship.hyperdrive_rating}</dd>
            </div>
            <div>
              <dt>Crew</dt>
              <dd>{state.starship.crew}</dd>
            </div>
            <div>
              <dt>Passengers</dt>
              <dd>{state.starship.passengers}</dd>
            </div>
            <div>
              <dt>Class</dt>
              <dd>{state.starship.starship_class}</dd>
            </div>
          </dl>
        </article>
      )}
    </section>
  )
}

export default StarshipDetailPage
