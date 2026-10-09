import { useEffect, useState } from 'react'
import CharacterList from './components/CharacterList.jsx'
import CharacterDetails from './components/CharacterDetails.jsx'
import SearchBar from './components/SearchBar.jsx'

export default function App() {
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

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
    return <p>Loading...</p>
  }

  if (error) {
    return <p role="alert">Error: {error}</p>
  }

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="app">
      <h1>Star Wars Characters</h1>
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CharacterList
        characters={filteredCharacters}
        onSelectCharacter={setSelectedCharacter}
      />
      <CharacterDetails character={selectedCharacter} />
    </main>
  )
}
