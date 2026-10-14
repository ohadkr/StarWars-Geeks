import { describe, expect, it } from 'vitest'
import type { Character } from '../types/character'
import { parseFavoritesImport, serializeFavorites } from './favorites'

function createCharacter(name: string): Character {
  return {
    name,
    height: 'unknown',
    mass: 'unknown',
    hair_color: 'unknown',
    skin_color: 'unknown',
    eye_color: 'unknown',
    birth_year: 'unknown',
    gender: 'unknown',
    homeworld: '',
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    created: '',
    edited: '',
    url: `https://swapi.info/api/people/${name}`,
  }
}

describe('favorites JSON helpers', () => {
  it('parses valid characters and removes duplicate URLs', () => {
    const luke = createCharacter('1')
    expect(parseFavoritesImport([luke, luke])).toEqual([luke])
  })

  it('rejects invalid payloads', () => {
    expect(() => parseFavoritesImport({ favorites: [] })).toThrow(
      'does not contain valid Star Wars favorites',
    )
    expect(() => parseFavoritesImport([{ name: 'Luke' }])).toThrow(
      'does not contain valid Star Wars favorites',
    )
  })

  it('serializes favorites as readable JSON', () => {
    const favorites = [createCharacter('1')]
    expect(serializeFavorites(favorites)).toBe(
      JSON.stringify(favorites, null, 2),
    )
  })
})
