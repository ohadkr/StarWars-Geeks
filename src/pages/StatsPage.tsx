import { useEffect, useState } from 'react'
import { useFavorites } from '../context/useFavorites'
import { fetchCharacters } from '../services/swapi'
import type { Character } from '../types/character'
import {
  genderCategories,
  getAverage,
  getGenderBreakdown,
} from '../utils/stats'
import './StatsPage.css'

type CharactersState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; characters: Character[] }

function formatAverage(value: number | null, unit: string): string {
  return value === null ? 'N/A' : `${value.toFixed(1)} ${unit}`
}

function StatsPage() {
  const { favorites } = useFavorites()
  const [state, setState] = useState<CharactersState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function loadCharacters() {
      try {
        const characters = await fetchCharacters(controller.signal)
        setState({ status: 'success', characters })
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'An unexpected error occurred'
        setState({ status: 'error', message })
      }
    }

    void loadCharacters()

    return () => controller.abort()
  }, [])

  const characters = state.status === 'success' ? state.characters : []
  const genderCounts = getGenderBreakdown(characters)

  const totalCharacters = characters.length
  const favoritePercentage =
    totalCharacters > 0 ? (favorites.length / totalCharacters) * 100 : 0

  return (
    <section className="stats-page">
      <h1>Statistics</h1>
      {state.status === 'loading' && (
        <p className="stats-page__message" role="status">
          Loading statistics...
        </p>
      )}
      {state.status === 'error' && (
        <p className="stats-page__message" role="alert">
          Statistics could not be loaded: {state.message}
        </p>
      )}
      {state.status === 'success' && (
        <>
          <div className="stats-page__summary">
            <article className="stats-card stats-card--highlight">
              <h2>Total characters</h2>
              <p className="stats-card__value">{totalCharacters}</p>
              <p className="stats-card__detail">
                {favorites.length} favorites · {favoritePercentage.toFixed(1)}%
                favorited
              </p>
            </article>
            <article className="stats-card">
              <h2>Average height</h2>
              <p className="stats-card__value">
                {formatAverage(
                  getAverage(characters.map((character) => character.height)),
                  'cm',
                )}
              </p>
              <p className="stats-card__detail">Characters with valid heights</p>
            </article>
            <article className="stats-card">
              <h2>Average mass</h2>
              <p className="stats-card__value">
                {formatAverage(
                  getAverage(characters.map((character) => character.mass)),
                  'kg',
                )}
              </p>
              <p className="stats-card__detail">Characters with valid masses</p>
            </article>
          </div>

          <section className="stats-page__gender" aria-labelledby="gender-title">
            <h2 id="gender-title">Gender breakdown</h2>
            <div className="stats-page__gender-grid">
              {genderCategories.map((category) => {
                const count = genderCounts[category]
                const percentage =
                  totalCharacters > 0 ? (count / totalCharacters) * 100 : 0

                return (
                  <article className="stats-card stats-card--gender" key={category}>
                    <h3>{category === 'n/a' ? 'N/A' : category}</h3>
                    <p className="stats-card__value">{count}</p>
                    <p className="stats-card__detail">
                      {percentage.toFixed(1)}% of characters
                    </p>
                  </article>
                )
              })}
            </div>
          </section>

          {favorites.length === 0 && (
            <p className="stats-page__empty">
              You haven&apos;t added any favorites yet.
            </p>
          )}
        </>
      )}
    </section>
  )
}

export default StatsPage
