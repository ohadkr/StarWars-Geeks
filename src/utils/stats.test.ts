import { describe, expect, it } from 'vitest'
import type { Character } from '../types/character'
import {
  filterAndSortCharacters,
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

describe('filterAndSortCharacters', () => {
  const characters = [
    createCharacter('Luke Skywalker', {
      gender: 'male',
      species: ['https://swapi.info/api/species/1'],
      homeworld: 'https://swapi.info/api/planets/1',
      height: '172',
      mass: '77',
    }),
    createCharacter('Leia Organa', {
      gender: 'female',
      species: [],
      homeworld: 'https://swapi.info/api/planets/2',
      height: '150',
      mass: '49',
    }),
    createCharacter('R2-D2', {
      gender: 'n/a',
      species: ['https://swapi.info/api/species/2'],
      homeworld: 'https://swapi.info/api/planets/1',
      height: '96',
      mass: 'unknown',
    }),
  ]

  const defaultFilters = {
    gender: 'all',
    filmUrl: '',
    speciesUrl: '',
    homeworldUrl: '',
    sortBy: 'name',
  } as const

  it('filters by gender, species, homeworld, and search together', () => {
    expect(
      filterAndSortCharacters(characters, 'luke', {
        ...defaultFilters,
        gender: 'male',
        speciesUrl: 'https://swapi.info/api/species/1',
        homeworldUrl: 'https://swapi.info/api/planets/1',
      }).map(({ name }) => name),
    ).toEqual(['Luke Skywalker'])
  })

  it('sorts numeric measurements ascending and puts unknown values last', () => {
    expect(
      filterAndSortCharacters(characters, '', {
        ...defaultFilters,
        sortBy: 'height',
      }).map(({ name }) => name),
    ).toEqual(['R2-D2', 'Leia Organa', 'Luke Skywalker'])
    expect(
      filterAndSortCharacters(characters, '', {
        ...defaultFilters,
        sortBy: 'mass',
      }).map(({ name }) => name),
    ).toEqual(['Leia Organa', 'Luke Skywalker', 'R2-D2'])
  })

  it('filters characters with no listed species', () => {
    expect(
      filterAndSortCharacters(characters, '', {
        ...defaultFilters,
        speciesUrl: 'none',
      }).map(({ name }) => name),
    ).toEqual(['Leia Organa'])
  })

  it('filters characters by film', () => {
    const charactersWithFilm = [
      {
        ...characters[0],
        films: ['https://swapi.info/api/films/1'],
      },
      ...characters.slice(1),
    ]
    expect(
      filterAndSortCharacters(charactersWithFilm, '', {
        ...defaultFilters,
        filmUrl: 'https://swapi.info/api/films/1',
      }).map(({ name }) => name),
    ).toEqual(['Luke Skywalker'])
    expect(
      filterAndSortCharacters(charactersWithFilm, '', {
        ...defaultFilters,
        filmUrl: 'https://swapi.info/api/films/2',
      }),
    ).toEqual([])
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
