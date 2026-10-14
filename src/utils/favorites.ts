import { isCharacter } from '../services/swapi'
import type { Character } from '../types/character'

export function parseFavoritesImport(value: unknown): Character[] {
  if (!Array.isArray(value) || !value.every(isCharacter)) {
    throw new Error('The selected file does not contain valid Star Wars favorites.')
  }

  return [...new Map(value.map((character) => [character.url, character])).values()]
}

export function serializeFavorites(favorites: Character[]): string {
  return JSON.stringify(favorites, null, 2)
}
