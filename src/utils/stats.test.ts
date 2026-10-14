import { describe, expect, it } from 'vitest'
import type { Character } from '../types/character'
import {
  filterCharactersByName,
  getAverage,
  getGenderBreakdown,
  sortCharactersByName,
} from './stats'

function createCharacter(
  name: string,
  overrides: Partial<Character> = {},
): Character {
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
    url: `https://swapi.info/api/people/${name.replaceAll(' ', '-')}`,
    ...overrides,
  }
}

describe('filterCharactersByName', () => {
  const characters = [
    createCharacter('Luke Skywalker'),
    createCharacter('Leia Organa'),
    createCharacter('Luke Lars'),
  ]

  it('filters by name without case sensitivity', () => {
    expect(filterCharactersByName(characters, 'lUkE')).toEqual([
      characters[0],
      characters[2],
    ])
  })

  it('returns every character for an empty or whitespace-only query', () => {
    expect(filterCharactersByName(characters, '')).toEqual(characters)
    expect(filterCharactersByName(characters, '   ')).toEqual(characters)
  })

  it('returns an empty list when no names match', () => {
    expect(filterCharactersByName(characters, 'Obi-Wan')).toEqual([])
  })
})

describe('sortCharactersByName', () => {
  it('sorts names alphabetically regardless of case without mutating input', () => {
    const characters = [
      createCharacter('luke'),
      createCharacter('Anakin'),
      createCharacter('obi-wan'),
    ]

    expect(sortCharactersByName(characters).map(({ name }) => name)).toEqual([
      'Anakin',
      'luke',
      'obi-wan',
    ])
    expect(characters.map(({ name }) => name)).toEqual([
      'luke',
      'Anakin',
      'obi-wan',
    ])
  })
})

describe('getAverage', () => {
  it('averages numeric values while ignoring unknown and invalid values', () => {
    expect(getAverage(['172', 'unknown', '77', 'not recorded', ''])).toBe(124.5)
  })

  it('returns null when there are no numeric values', () => {
    expect(getAverage(['unknown', 'n/a', ''])).toBeNull()
  })
})

describe('getGenderBreakdown', () => {
  it('counts male, female, n/a, and unknown genders', () => {
    const characters = [
      createCharacter('Luke', { gender: 'male' }),
      createCharacter('Leia', { gender: 'female' }),
      createCharacter('Droid', { gender: 'n/a' }),
      createCharacter('Unknown One', { gender: 'unknown' }),
      createCharacter('Unknown Two', { gender: 'unspecified' }),
    ]

    expect(getGenderBreakdown(characters)).toEqual({
      male: 1,
      female: 1,
      'n/a': 1,
      unknown: 2,
    })
  })
})
