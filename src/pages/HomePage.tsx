import { useEffect, useState } from 'react'
import CharacterCard from '../components/CharacterCard'
import SearchBar from '../components/SearchBar'
import { fetchCharacters } from '../services/swapi'
import type { Character } from '../types/character'

type CharactersState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; characters: Character[] }

function HomePage() {
  const [state, setState] = useState<CharactersState>({ status: 'loading' })
  const [searchQuery, setSearchQuery] = useState('')

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

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCharacters =
    state.status === 'success'
      ? state.characters.filter((character) =>
          character.name.toLowerCase().includes(normalizedQuery),
        )
      : []

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
          {filteredCharacters.length > 0 ? (
            <div className="character-grid">
              {filteredCharacters.map((character) => (
                <CharacterCard key={character.url} character={character} />
              ))}
            </div>
          ) : (
            <p role="status">No characters match your search.</p>
          )}
        </>
      )}
    </section>
  )
}

export default HomePage
