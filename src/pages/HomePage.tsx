import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CharacterCard from '../components/CharacterCard'
import FilmArtwork from '../components/FilmArtwork'
import NetworkNotice from '../components/NetworkNotice'
import SearchBar from '../components/SearchBar'
import { fetchResourceName } from '../services/swapi'
import { useCharacterDirectory } from '../hooks/useCharacterDirectory'
import { extractId } from '../utils/character'
import {
  filterAndSortCharacters,
  genderCategories,
  type CharacterFilters,
  type GenderCategory,
} from '../utils/stats'
import './HomePage.css'

function isGenderCategory(value: string): value is GenderCategory {
  return genderCategories.some((gender) => gender === value)
}

function getResourceFallbackName(url: string, resourceLabel: string): string {
  const id = extractId(url)
  return id ? `${resourceLabel} #${id}` : resourceLabel
}

function HomePage() {
  const navigate = useNavigate()
  const { state, retry } = useCharacterDirectory()
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [filters, setFilters] = useState<CharacterFilters>({
    gender: 'all',
    filmUrl: '',
    speciesUrl: '',
    homeworldUrl: '',
    sortBy: 'name',
  })
  const [resourceNames, setResourceNames] = useState<Record<string, string>>(
    {},
  )

  useEffect(() => {
    if (state.status !== 'success') {
      return
    }

    const controller = new AbortController()
    const resourceUrls = [
      ...new Set([
        ...state.characters.flatMap((character) => character.species),
        ...state.characters.map((character) => character.homeworld),
        ...state.characters.flatMap((character) => character.films),
      ]),
    ].filter(Boolean)

    async function loadResourceNames() {
      const names = await Promise.all(
        resourceUrls.map(async (url) => {
          const resourceLabel = url.includes('/species/')
            ? 'Species'
            : url.includes('/films/')
              ? 'Film'
              : 'Planet'

          try {
            const name = await fetchResourceName(url, controller.signal)
            return [url, name] as const
          } catch {
            return [url, getResourceFallbackName(url, resourceLabel)] as const
          }
        }),
      )

      if (!controller.signal.aborted) {
        setResourceNames(Object.fromEntries(names))
      }
    }

    void loadResourceNames()

    return () => controller.abort()
  }, [state])

  const speciesOptions =
    state.status === 'success'
      ? [...new Set(state.characters.flatMap((character) => character.species))]
      : []
  const homeworldOptions =
    state.status === 'success'
      ? [...new Set(state.characters.map((character) => character.homeworld))]
          .filter(Boolean)
      : []
  const filmOptions =
    state.status === 'success'
      ? [...new Set(state.characters.flatMap((character) => character.films))]
      : []
  const filteredCharacters =
    state.status === 'success'
      ? filterAndSortCharacters(state.characters, searchQuery, filters)
      : []

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      const target = event.target
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.matches('input, textarea, select, button, a'))

      if (
        event.key === '/' &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !isEditing
      ) {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleSearchShortcut)
    return () => window.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  function updateFilter<Key extends keyof CharacterFilters>(
    key: Key,
    value: CharacterFilters[Key],
  ) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }))
  }

  return (
    <section className="home-page">
      <h1>StarWars Geeks</h1>
      {state.status === 'loading' && (
        <p role="status">Loading characters...</p>
      )}
      {state.status === 'error' && (
        <NetworkNotice message={`Error: ${state.message}`} onRetry={retry} />
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
            <p role="status" className="home-page__cache-warning">
              {state.cacheWarning}
            </p>
          )}
          <button
            className="home-page__random"
            type="button"
            onClick={() => {
              const character =
                state.characters[Math.floor(Math.random() * state.characters.length)]
              if (character) {
                navigate(`/character/${extractId(character.url)}`)
              }
            }}
          >
            Surprise me with a character
          </button>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            inputRef={searchInputRef}
          />
          <p className="home-page__keyboard-tip">
            Press <kbd>/</kbd> to focus character search
          </p>
          <div
            className="character-controls"
            role="group"
            aria-label="Character filters and sorting"
          >
            <label className="character-controls__field">
              <span>Gender</span>
              <select
                value={filters.gender}
                onChange={(event) => {
                  const value = event.currentTarget.value
                  if (value === 'all' || isGenderCategory(value)) {
                    updateFilter('gender', value)
                  }
                }}
              >
                <option value="all">All genders</option>
                {genderCategories.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender === 'n/a'
                      ? 'N/A'
                      : gender[0].toUpperCase() + gender.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <div className="character-controls__field character-controls__field--films">
              <span>Film</span>
              <div
                className="film-filter-options"
                role="group"
                aria-label="Filter characters by film"
              >
                <button
                  className="film-filter-option"
                  type="button"
                  aria-pressed={filters.filmUrl === ''}
                  onClick={() => updateFilter('filmUrl', '')}
                >
                  <span className="film-filter-option__all" aria-hidden="true">
                    All
                  </span>
                  <span>All films</span>
                </button>
                {filmOptions.map((url) => (
                  <button
                    className="film-filter-option"
                    key={url}
                    type="button"
                    aria-pressed={filters.filmUrl === url}
                    onClick={() => updateFilter('filmUrl', url)}
                  >
                    <FilmArtwork
                      filmId={extractId(url)}
                      filmTitle={resourceNames[url] ?? 'Film'}
                      size="thumbnail"
                    />
                    <span>
                      {resourceNames[url] ?? 'Loading film name...'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <label className="character-controls__field">
              <span>Species</span>
              <select
                value={filters.speciesUrl}
                onChange={(event) =>
                  updateFilter('speciesUrl', event.currentTarget.value)
                }
              >
                <option value="">All species</option>
                {speciesOptions.map((url) => (
                  <option key={url} value={url}>
                    {resourceNames[url] ?? 'Loading species name...'}
                  </option>
                ))}
                <option value="none">No species listed</option>
              </select>
            </label>
            <label className="character-controls__field">
              <span>Homeworld</span>
              <select
                value={filters.homeworldUrl}
                onChange={(event) =>
                  updateFilter('homeworldUrl', event.currentTarget.value)
                }
              >
                <option value="">All homeworlds</option>
                {homeworldOptions.map((url) => (
                  <option key={url} value={url}>
                    {resourceNames[url] ?? 'Loading homeworld name...'}
                  </option>
                ))}
              </select>
            </label>
            <label className="character-controls__field">
              <span>Sort by</span>
              <select
                value={filters.sortBy}
                onChange={(event) => {
                  const value = event.currentTarget.value
                  if (value === 'name' || value === 'height' || value === 'mass') {
                    updateFilter('sortBy', value)
                  }
                }}
              >
                <option value="name">Name (A–Z)</option>
                <option value="height">Height (low to high)</option>
                <option value="mass">Mass (low to high)</option>
              </select>
            </label>
            <button
              className="character-controls__reset"
              type="button"
              onClick={() => {
                setSearchQuery('')
                setFilters({
                  gender: 'all',
                  filmUrl: '',
                  speciesUrl: '',
                  homeworldUrl: '',
                  sortBy: 'name',
                })
              }}
            >
              Reset filters
            </button>
          </div>
          <p className="home-page__result-count" aria-live="polite">
            Showing {filteredCharacters.length} of {state.characters.length}{' '}
            characters
          </p>
          {filteredCharacters.length > 0 ? (
            <div className="character-grid">
              {filteredCharacters.map((character) => (
                <CharacterCard key={character.url} character={character} />
              ))}
            </div>
          ) : (
            <p role="status">No characters match these filters.</p>
          )}
        </>
      )}
    </section>
  )
}

export default HomePage
