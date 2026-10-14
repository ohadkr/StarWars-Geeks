import { createContext } from 'react'
import type { Character } from '../types/character'

export interface FavoritesContextValue {
  favorites: Character[]
  storageError: string | null
  isFavorite: (character: Character) => boolean
  toggleFavorite: (character: Character) => void
}

export const FavoritesContext =
  createContext<FavoritesContextValue | null>(null)
