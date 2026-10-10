import { useEffect, useState } from 'react'
import CharacterList from './components/CharacterList.jsx'
import CharacterDetails from './components/CharacterDetails.jsx'
import SearchBar from './components/SearchBar.jsx'
import './App.css'

function readUrlFilters() {
  const params = new URLSearchParams(window.location.search)

  return {
    searchQuery: params.get('q') ?? '',
    showFavoritesOnly: params.get('favorites') === '1',
    sortOrder: params.get('sort') === 'desc' ? 'desc' : 'asc',
  }
}

export default function App() {
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fetchAttempt, setFetchAttempt] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [searchQuery, setSearchQuery] = useState(() => readUrlFilters().searchQuery)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(() => readUrlFilters().showFavoritesOnly)
  const [sortOrder, setSortOrder] = useState(() => readUrlFilters().sortOrder)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('sw_theme')
    return savedTheme === 'day' ? 'day' : 'night'
  })
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('sw_favorites'))
      return Array.isArray(savedFavorites) ? savedFavorites : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('sw_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('sw_theme', theme)
  }, [theme])

  useEffect(() => {
    const url = new URL(window.location.href)

    if (searchQuery) {
      url.searchParams.set('q', searchQuery)
    } else {
      url.searchParams.delete('q')
    }

    if (showFavoritesOnly) {
      url.searchParams.set('favorites', '1')
    } else {
      url.searchParams.delete('favorites')
    }

    if (sortOrder === 'desc') {
      url.searchParams.set('sort', sortOrder)
    } else {
      url.searchParams.delete('sort')
    }

    window.history.replaceState(null, '', url)
  }, [searchQuery, showFavoritesOnly, sortOrder])

  useEffect(() => {
    function restoreFiltersFromUrl() {
      const filters = readUrlFilters()
      setSearchQuery(filters.searchQuery)
      setShowFavoritesOnly(filters.showFavoritesOnly)
      setSortOrder(filters.sortOrder)
    }

    window.addEventListener('popstate', restoreFiltersFromUrl)
    return () => window.removeEventListener('popstate', restoreFiltersFromUrl)
  }, [])

  function toggleFavorite(characterName) {
    setFavorites((currentFavorites) => (
      currentFavorites.includes(characterName)
        ? currentFavorites.filter((favorite) => favorite !== characterName)
        : [...currentFavorites, characterName]
    ))
  }

  useEffect(() => {
    const controller = new AbortController()

    async function fetchCharacters() {
      try {
        const response = await fetch('https://swapi.info/api/people', {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        setCharacters(data)
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return
        }

        setError('Unable to load characters. Please check your connection and try again.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchCharacters()
    return () => controller.abort()
  }, [fetchAttempt])

  function retryLoadingCharacters() {
    setError(null)
    setIsLoading(true)
    setFetchAttempt((attempt) => attempt + 1)
  }

  function resetFilters() {
    setSearchQuery('')
    setShowFavoritesOnly(false)
  }

  if (isLoading) {
    return (
      <div className={`app-shell app-shell--${theme}`}>
        <main className="app app--status"><p className="status-message">Loading characters...</p></main>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`app-shell app-shell--${theme}`}>
        <main className="app app--status">
          <div className="status-message status-message--error" role="alert">
            <p>Error: {error}</p>
            <button className="retry-button" type="button" onClick={retryLoadingCharacters}>
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  const filteredCharacters = characters
    .filter((character) =>
      character.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showFavoritesOnly || favorites.includes(character.name)),
    )
    .slice()
    .sort((first, second) => {
      const comparison = first.name.localeCompare(second.name, undefined, { sensitivity: 'base' })
      return sortOrder === 'asc' ? comparison : -comparison
    })

  return (
    <div className={`app-shell app-shell--${theme}`}>
      <main className="app">
      <header className="app-header">
        <div className="app-header__topline">
          <p className="app-kicker">GALACTIC ARCHIVE / 01</p>
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === 'night' ? 'day' : 'night'} mode`}
            onClick={() => setTheme((currentTheme) => currentTheme === 'night' ? 'day' : 'night')}
          >
            <span aria-hidden="true">{theme === 'night' ? '\u2600' : '\u263e'}</span>
            {theme === 'night' ? 'Day mode' : 'Night mode'}
          </button>
        </div>
        <h1>Star Wars <span>Geeks</span></h1>
      </header>
      <div className="character-workspace">
        <section className="roster-panel" aria-labelledby="roster-heading">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">FIELD INDEX</p>
              <h2 id="roster-heading">Characters</h2>
            </div>
            <span className="character-count">{filteredCharacters.length.toString().padStart(2, '0')}</span>
          </div>
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <label className="sort-control">
            <span>Sort by name</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
          </label>
          <div className="roster-filter-row">
            <label className="favorites-filter">
              <input
                className="favorites-filter__input"
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(event) => setShowFavoritesOnly(event.target.checked)}
              />
              <span className="favorites-filter__indicator" aria-hidden="true" />
              <span>Show Favorites</span>
              <span className="favorites-filter__count">{favorites.length}</span>
            </label>
            <button
              className="filter-reset"
              type="button"
              onClick={resetFilters}
              disabled={!searchQuery && !showFavoritesOnly}
            >
              Reset filters
            </button>
          </div>
          <CharacterList
            characters={filteredCharacters}
            onSelectCharacter={setSelectedCharacter}
            selectedCharacter={selectedCharacter}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </section>
        <CharacterDetails
          character={selectedCharacter}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>
      </main>
    </div>
  )
}
