import { describe, expect, it } from 'vitest'
import type { Character } from '../types/character'
import { getSimilarCharacters } from './recommendations'

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
    url: `https://swapi.info/api/people/${name}`,
    ...overrides,
  }
}

describe('getSimilarCharacters', () => {
  it('ranks characters by shared homeworld, species, and films', () => {
    const selected = createCharacter('Luke', {
      homeworld: 'https://swapi.info/api/planets/1',
      species: ['https://swapi.info/api/species/1'],
      films: ['https://swapi.info/api/films/1'],
    })
    const sameFilm = createCharacter('Leia', {
      films: ['https://swapi.info/api/films/1'],
    })
    const highlySimilar = createCharacter('Anakin', {
      homeworld: selected.homeworld,
      species: [...selected.species],
      films: [...selected.films],
    })

    expect(
      getSimilarCharacters(selected, [selected, sameFilm, highlySimilar]).map(
        ({ character }) => character.name,
      ),
    ).toEqual(['Anakin', 'Leia'])
    expect(
      getSimilarCharacters(selected, [sameFilm], 0),
    ).toEqual([])
  })

  it('does not recommend characters with no shared attributes', () => {
    const selected = createCharacter('Luke')
    const unrelated = createCharacter('Yoda', {
      homeworld: 'unknown',
      films: ['https://swapi.info/api/films/8'],
    })

    expect(getSimilarCharacters(selected, [unrelated])).toEqual([])
  })
})
