import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CharacterCard from '../components/CharacterCard'
import FilmArtwork from '../components/FilmArtwork'
import NetworkNotice from '../components/NetworkNotice'
import { useCharacterDirectory } from '../hooks/useCharacterDirectory'
import { fetchFilm, type Film } from '../services/swapi'
import './FilmDetailPage.css'

type FilmState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; film: Film }

function FilmDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { state: directoryState, retry: retryDirectory } =
    useCharacterDirectory()
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{
    attempt: number
    state: FilmState
  }>({ attempt: 0, state: { status: 'loading' } })

  useEffect(() => {
    const controller = new AbortController()
    const filmId = id && /^\d+$/.test(id) ? Number(id) : Number.NaN

    async function loadFilm() {
      try {
        const film = await fetchFilm(filmId, controller.signal)
        setResult({ attempt, state: { status: 'success', film } })
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return
        }
        const message =
          error instanceof Error ? error.message : 'An unexpected error occurred'
        setResult({ attempt, state: { status: 'error', message } })
      }
    }

    void loadFilm()
    return () => controller.abort()
  }, [attempt, id])

  const filmState =
    result.attempt === attempt
      ? result.state
      : ({ status: 'loading' } as const)
  const filmId = id && /^\d+$/.test(id) ? String(Number(id)) : ''
  const filmUrl = filmId ? `https://swapi.info/api/films/${filmId}` : ''
  const filmCharacters =
    directoryState.status === 'success'
      ? directoryState.characters.filter((character) =>
          character.films.includes(filmUrl),
        )
      : []

  function retry() {
    setAttempt((current) => current + 1)
    retryDirectory()
  }

  return (
    <section className="film-detail">
      <Link className="film-detail__back" to="/">
        Back to characters
      </Link>
      {filmState.status === 'loading' && (
        <p role="status">Loading film details...</p>
      )}
      {filmState.status === 'error' && (
        <NetworkNotice
          message={`Film details could not be loaded: ${filmState.message}`}
          onRetry={retry}
        />
      )}
      {filmState.status === 'success' && (
        <>
          <header className="film-detail__header">
            <p className="film-detail__eyebrow">
              Episode {filmState.film.episode_id}
            </p>
            <div className="film-detail__title-row">
              <FilmArtwork
                filmId={filmId}
                filmTitle={filmState.film.title}
                size="poster"
              />
              <h1>{filmState.film.title}</h1>
            </div>
            <p className="film-detail__meta">
              Directed by {filmState.film.director}
            </p>
            <p className="film-detail__meta">
              Released {filmState.film.release_date}
            </p>
          </header>
          {directoryState.status === 'error' && (
            <NetworkNotice
              message={`Character list could not be loaded: ${directoryState.message}`}
              onRetry={retry}
            />
          )}
          {directoryState.status === 'success' &&
            directoryState.networkError && (
              <NetworkNotice
                message={directoryState.networkError}
                onRetry={retry}
                savedData={directoryState.source === 'cache'}
              />
            )}
          <section
            className="film-detail__crawl"
            aria-labelledby="film-crawl-title"
          >
            <h2 id="film-crawl-title">Opening crawl</h2>
            <p>{filmState.film.opening_crawl}</p>
          </section>
          <section
            className="film-detail__characters"
            aria-labelledby="film-characters-title"
          >
            <h2 id="film-characters-title">Characters in this film</h2>
            {directoryState.status === 'loading' ? (
              <p role="status">Loading characters...</p>
            ) : filmCharacters.length > 0 ? (
              <div className="character-grid">
                {filmCharacters.map((character) => (
                  <CharacterCard key={character.url} character={character} />
                ))}
              </div>
            ) : directoryState.status === 'success' ? (
              <p>No characters were found for this film.</p>
            ) : null}
          </section>
        </>
      )}
    </section>
  )
}

export default FilmDetailPage
