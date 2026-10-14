import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FilmArtwork from '../components/FilmArtwork'
import NetworkNotice from '../components/NetworkNotice'
import { fetchFilms, type Film } from '../services/swapi'
import { extractId } from '../utils/character'
import './FilmsPage.css'

type FilmsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; films: Film[] }

function FilmsPage() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{
    attempt: number
    state: FilmsState
  }>({ attempt: 0, state: { status: 'loading' } })

  useEffect(() => {
    const controller = new AbortController()

    fetchFilms(controller.signal)
      .then((films) => {
        if (!controller.signal.aborted) {
          setResult({
            attempt,
            state: {
              status: 'success',
              films: [...films].sort(
                (first, second) => first.episode_id - second.episode_id,
              ),
            },
          })
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
    <section className="films-page">
      <header className="films-page__header">
        <p className="films-page__eyebrow">Explore the saga</p>
        <h1>Star Wars Films</h1>
        <p>Browse all six films in episode order.</p>
      </header>
      {state.status === 'loading' && (
        <p className="films-page__message" role="status">
          Loading films...
        </p>
      )}
      {state.status === 'error' && (
        <NetworkNotice
          message={`Films could not be loaded: ${state.message}`}
          onRetry={() => setAttempt((current) => current + 1)}
        />
      )}
      {state.status === 'success' && (
        <div className="films-page__grid">
          {state.films.map((film) => {
            const filmId = extractId(film.url)

            return (
              <Link
                className="film-card"
                key={film.url}
                to={`/film/${filmId}`}
                aria-label={`Episode ${film.episode_id}: ${film.title}`}
              >
                <FilmArtwork
                  filmId={filmId}
                  filmTitle={film.title}
                  size="poster"
                />
                <div className="film-card__details">
                  <p className="film-card__episode">
                    Episode {film.episode_id}
                  </p>
                  <h2>{film.title}</h2>
                  <p className="film-card__release">
                    Released {film.release_date}
                  </p>
                  <span className="film-card__link">View film details</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default FilmsPage
