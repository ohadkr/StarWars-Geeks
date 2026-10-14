import { useEffect, useState } from 'react'
import CharacterCard from '../components/CharacterCard'
import SearchBar from '../components/SearchBar'
import { fetchCharacters, fetchResourceName } from '../services/swapi'
import type { Character } from '../types/character'
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

type CharactersState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; characters: Character[] }

function HomePage() {
  const [state, setState] = useState<CharactersState>({ status: 'loading' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<CharacterFilters>({
    gender: 'all',
    speciesUrl: '',
    homeworldUrl: '',
    sortBy: 'name',
  })
  const [resourceNames, setResourceNames] = useState<Record<string, string>>(
    {},
  )

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

  useEffect(() => {
    if (state.status !== 'success') {
      return
    }

    const controller = new AbortController()
    const resourceUrls = [
      ...new Set([
        ...state.characters.flatMap((character) => character.species),
        ...state.characters.map((character) => character.homeworld),
      ]),
    ].filter(Boolean)

    async function loadResourceNames() {
      const names = await Promise.all(
        resourceUrls.map(async (url) => {
          const resourceLabel = url.includes('/species/')
            ? 'Species'
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
  const filteredCharacters =
    state.status === 'success'
      ? filterAndSortCharacters(state.characters, searchQuery, filters)
      : []

  function updateFilter<Key extends keyof CharacterFilters>(
    key: Key,
    value: CharacterFilters[Key],
  ) {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }))
  }

  return (
    <section className="home-page">
      <h1>Home - StarWars Geeks</h1>
      {state.status === 'loading' && (
        <p role="status">Loading characters...</p>
      )}
      {state.status === 'error' && <p role="alert">Error: {state.message}</p>}
      {state.status === 'success' && (
        <>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
