import { useState } from 'react'
import CharacterCard from '../components/CharacterCard'
import { useFavorites } from '../context/useFavorites'
import type { CharacterSortField } from '../utils/stats'
import { filterAndSortCharacters } from '../utils/stats'
import { parseFavoritesImport, serializeFavorites } from '../utils/favorites'
import './FavoritesPage.css'

function FavoritesPage() {
  const { favorites, replaceFavorites } = useFavorites()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<CharacterSortField>('name')
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const displayedFavorites = filterAndSortCharacters(favorites, query, {
    gender: 'all',
    filmUrl: '',
    speciesUrl: '',
    homeworldUrl: '',
    sortBy,
  })

  function exportFavorites() {
    const blob = new Blob([serializeFavorites(favorites)], {
      type: 'application/json',
    })
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = 'star-wars-geeks-favorites.json'
    link.click()
    URL.revokeObjectURL(downloadUrl)
  }

  async function importFavorites(file: File | undefined) {
    setImportMessage(null)
    setImportError(null)
    if (!file) {
      return
    }

    try {
      const contents: unknown = JSON.parse(await file.text())
      const importedFavorites = parseFavoritesImport(contents)
      replaceFavorites(importedFavorites)
      setImportMessage(`Imported ${importedFavorites.length} favorites.`)
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'The selected file could not be read.'
      setImportError(`Favorites were not imported: ${message}`)
    }
  }

  return (
    <section className="favorites-page">
      <h1>Favorites</h1>
      <div className="favorites-page__tools">
        <label className="favorites-page__search">
          <span>Search favorites</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search by character name"
          />
        </label>
        <label className="favorites-page__sort">
          <span>Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => {
              const value = event.currentTarget.value
              if (value === 'name' || value === 'height' || value === 'mass') {
                setSortBy(value)
              }
            }}
          >
            <option value="name">Name (A–Z)</option>
            <option value="height">Height (low to high)</option>
            <option value="mass">Mass (low to high)</option>
          </select>
        </label>
        <button type="button" onClick={exportFavorites}>
          Export JSON
        </button>
        <label className="favorites-page__import">
          <span>Import JSON</span>
          <input
            type="file"
            accept="application/json,.json"
            aria-label="Import favorites from JSON"
            onChange={(event) => {
              void importFavorites(event.currentTarget.files?.[0])
              event.currentTarget.value = ''
            }}
          />
        </label>
      </div>
      {importMessage && (
        <p className="favorites-page__notice" role="status">
          {importMessage}
        </p>
      )}
      {importError && (
        <p className="favorites-page__error" role="alert">
          {importError}
        </p>
      )}
      {favorites.length === 0 ? (
        <p className="favorites-page__empty">
          You haven&apos;t added any characters to your favorites yet.
        </p>
      ) : displayedFavorites.length === 0 ? (
        <p className="favorites-page__empty" role="status">
          No favorites match your search.
        </p>
      ) : (
        <>
          <p className="favorites-page__result-count" aria-live="polite">
            Showing {displayedFavorites.length} of {favorites.length} favorites
          </p>
          <div className="character-grid">
            {displayedFavorites.map((character) => (
              <CharacterCard key={character.url} character={character} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default FavoritesPage
