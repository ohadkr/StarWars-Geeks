import {
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import { isCharacter } from '../services/swapi'
import type { Character } from '../types/character'
import { FavoritesContext } from './FavoritesContext'

const FAVORITES_STORAGE_KEY = 'starwars-geeks-favorites'

interface StoredFavorites {
  favorites: Character[]
  error: string | null
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown storage error'
}

function readFavorites(): StoredFavorites {
  try {
    const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY)

    if (storedFavorites === null) {
      return { favorites: [], error: null }
    }

    const parsed: unknown = JSON.parse(storedFavorites)

    if (!Array.isArray(parsed) || !parsed.every(isCharacter)) {
      return {
        favorites: [],
        error: 'Saved favorites have an invalid format and could not be loaded.',
      }
    }

    return { favorites: parsed, error: null }
  } catch (error: unknown) {
    return {
      favorites: [],
      error: `Saved favorites could not be loaded: ${getErrorMessage(error)}`,
    }
  }
}

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [storedFavorites] = useState(readFavorites)
  const [favorites, setFavorites] = useState(storedFavorites.favorites)
  const [storageError, setStorageError] = useState<string | null>(
    storedFavorites.error,
  )

  const isFavorite = useCallback(
    (character: Character) =>
      favorites.some((favorite) => favorite.url === character.url),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (character: Character) => {
      const nextFavorites = isFavorite(character)
        ? favorites.filter((favorite) => favorite.url !== character.url)
        : [...favorites, character]

      setFavorites(nextFavorites)

      try {
        window.localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(nextFavorites),
        )
        setStorageError(null)
      } catch (error: unknown) {
        setStorageError(
          `Favorites could not be saved: ${getErrorMessage(error)}`,
        )
      }
    },
    [favorites, isFavorite],
  )

  return (
    <FavoritesContext.Provider
      value={{ favorites, storageError, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
