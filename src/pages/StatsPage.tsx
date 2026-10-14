import NetworkNotice from '../components/NetworkNotice'
import { useCharacterDirectory } from '../hooks/useCharacterDirectory'
import { useFavorites } from '../context/useFavorites'
import type { Character } from '../types/character'
import {
  genderCategories,
  getAverage,
  getGenderBreakdown,
} from '../utils/stats'
import './StatsPage.css'

function formatAverage(value: number | null, unit: string): string {
  return value === null ? 'N/A' : `${value.toFixed(1)} ${unit}`
}

function StatsGroup({
  title,
  characters,
  detail,
}: {
  title: string
  characters: Character[]
  detail?: string
}) {
  const genderCounts = getGenderBreakdown(characters)

  return (
    <section className="stats-page__group" aria-label={`${title} statistics`}>
      <h2>{title}</h2>
      <div className="stats-page__summary">
        <article className="stats-card stats-card--highlight">
          <h3>Total characters</h3>
          <p className="stats-card__value">{characters.length}</p>
          {detail && <p className="stats-card__detail">{detail}</p>}
        </article>
        <article className="stats-card">
          <h3>Average height</h3>
          <p className="stats-card__value">
            {formatAverage(
              getAverage(characters.map((character) => character.height)),
              'cm',
            )}
          </p>
          <p className="stats-card__detail">Characters with valid heights</p>
        </article>
        <article className="stats-card">
          <h3>Average mass</h3>
          <p className="stats-card__value">
            {formatAverage(
              getAverage(characters.map((character) => character.mass)),
              'kg',
            )}
          </p>
          <p className="stats-card__detail">Characters with valid masses</p>
        </article>
      </div>

      <div className="stats-page__gender">
        <h3>Gender breakdown</h3>
        <div className="stats-page__gender-grid">
          {genderCategories.map((category) => {
            const count = genderCounts[category]
            const percentage =
              characters.length > 0 ? (count / characters.length) * 100 : 0

            return (
              <article className="stats-card stats-card--gender" key={category}>
                <h4>{category === 'n/a' ? 'N/A' : category}</h4>
                <p className="stats-card__value">{count}</p>
                <p className="stats-card__detail">
                  {percentage.toFixed(1)}% of this group
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StatsPage() {
  const { favorites } = useFavorites()
  const { state, retry } = useCharacterDirectory()

  return (
    <section className="stats-page">
      <h1>Statistics</h1>
      {state.status === 'loading' && (
        <p className="stats-page__message" role="status">
          Loading statistics...
        </p>
      )}
      {state.status === 'error' && (
        <NetworkNotice
          message={`Statistics could not be loaded: ${state.message}`}
          onRetry={retry}
        />
      )}
      {state.status === 'success' && (
        <>
          {state.networkError && (
            <NetworkNotice
              message={state.networkError}
              onRetry={retry}
              savedData={state.source === 'cache'}
            />
          )}
          {state.cacheWarning && (
            <p className="stats-page__message" role="status">
              {state.cacheWarning}
            </p>
          )}
          <StatsGroup
            title="All characters"
            characters={state.characters}
            detail={`${favorites.length} favorites · ${
              state.characters.length > 0
                ? ((favorites.length / state.characters.length) * 100).toFixed(1)
                : '0.0'
            }% favorited`}
          />
          <StatsGroup title="Your favorites" characters={favorites} />
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
