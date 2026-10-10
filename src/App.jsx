import { useEffect, useState } from 'react'
import CharacterList from './components/CharacterList.jsx'
import CharacterDetails from './components/CharacterDetails.jsx'
import SearchBar from './components/SearchBar.jsx'
import './App.css'

export default function App() {
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
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
  }, [])

  if (isLoading) {
    return <main className="app app--status"><p className="status-message">Loading characters...</p></main>
  }

  if (error) {
    return <main className="app app--status"><p className="status-message status-message--error" role="alert">Error: {error}</p></main>
  }

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="app">
      <header className="app-header">
        <p className="app-kicker">GALACTIC ARCHIVE / 01</p>
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
  )
}
