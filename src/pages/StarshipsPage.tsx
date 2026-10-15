import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NetworkNotice from '../components/NetworkNotice'
import StarshipArtwork from '../components/StarshipArtwork'
import { fetchStarships, type Starship } from '../services/swapi'
import { extractId } from '../utils/character'
import './StarshipsPage.css'

type StarshipsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; starships: Starship[] }

function StarshipsPage() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{
    attempt: number
    state: StarshipsState
  }>({ attempt: 0, state: { status: 'loading' } })

  useEffect(() => {
    const controller = new AbortController()

    fetchStarships(controller.signal)
      .then((starships) => {
        if (!controller.signal.aborted) {
          setResult({ attempt, state: { status: 'success', starships } })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          const message =
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred'
          setResult({ attempt, state: { status: 'error', message } })
        }
      })

    return () => controller.abort()
  }, [attempt])

  const state =
    result.attempt === attempt
      ? result.state
      : ({ status: 'loading' } as const)

  return (
    <section className="starships-page">
      <header className="starships-page__header">
        <p className="starships-page__eyebrow">Explore the galaxy</p>
        <h1>Starships</h1>
        <p>Discover the vessels that travel across the Star Wars galaxy.</p>
      </header>
      {state.status === 'loading' && (
        <p className="starships-page__message" role="status">
          Loading starships...
        </p>
      )}
      {state.status === 'error' && (
        <NetworkNotice
          message={`Starships could not be loaded: ${state.message}`}
          onRetry={() => setAttempt((current) => current + 1)}
        />
      )}
      {state.status === 'success' && (
        <div className="starships-page__grid">
          {state.starships.map((starship) => {
            const starshipId = extractId(starship.url)

            return (
              <Link
                className="starship-card"
                key={starship.url}
                to={`/starships/${starshipId}`}
                aria-label={`View details for ${starship.name}`}
              >
                <StarshipArtwork
                  starshipId={starshipId}
                  starshipName={starship.name}
                  size="card"
                />
                <div className="starship-card__details">
                  <h2>{starship.name}</h2>
                  <p>{starship.model}</p>
                  <span>View starship details</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default StarshipsPage
