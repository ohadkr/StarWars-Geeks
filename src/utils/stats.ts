import type { Character } from '../types/character'

export const genderCategories = ['male', 'female', 'n/a', 'unknown'] as const

export type GenderCategory = (typeof genderCategories)[number]

export type GenderBreakdown = Record<GenderCategory, number>

export type CharacterSortField = 'name' | 'height' | 'mass'

export interface CharacterFilters {
  gender: GenderCategory | 'all'
  speciesUrl: string
  homeworldUrl: string
  sortBy: CharacterSortField
}

export function filterCharactersByName(
  characters: Character[],
  query: string,
): Character[] {
  const normalizedQuery = query.trim().toLowerCase()

  return characters.filter((character) =>
    character.name.toLowerCase().includes(normalizedQuery),
  )
}

function parseMeasurement(value: string): number | null {
  const normalizedValue = value.trim()

  if (!normalizedValue || normalizedValue.toLowerCase() === 'unknown') {
    return null
  }

  const measurement = Number(normalizedValue)
  return Number.isFinite(measurement) ? measurement : null
}

export function filterAndSortCharacters(
  characters: Character[],
  query: string,
  filters: CharacterFilters,
): Character[] {
  const filtered = filterCharactersByName(characters, query).filter(
    (character) => {
      const genderMatches =
        filters.gender === 'all' ||
        getGenderCategory(character.gender) === filters.gender
      const speciesMatches =
        !filters.speciesUrl ||
        character.species.includes(filters.speciesUrl) ||
        (filters.speciesUrl === 'none' && character.species.length === 0)
      const homeworldMatches =
        !filters.homeworldUrl || character.homeworld === filters.homeworldUrl

      return genderMatches && speciesMatches && homeworldMatches
    },
  )

  return filtered.sort((first, second) => {
    if (filters.sortBy === 'name') {
      return first.name.localeCompare(second.name, undefined, {
        sensitivity: 'base',
      })
    }

    const firstValue = parseMeasurement(first[filters.sortBy])
    const secondValue = parseMeasurement(second[filters.sortBy])

    if (firstValue === null || secondValue === null) {
      if (firstValue === secondValue) {
        return first.name.localeCompare(second.name, undefined, {
          sensitivity: 'base',
        })
      }

      return firstValue === null ? 1 : -1
    }

    return (
      firstValue - secondValue ||
      first.name.localeCompare(second.name, undefined, {
        sensitivity: 'base',
      })
    )
  })
}

export function sortCharactersByName(characters: Character[]): Character[] {
  return [...characters].sort((first, second) =>
    first.name.localeCompare(second.name, undefined, { sensitivity: 'base' }),
  )
}

export function getAverage(values: string[]): number | null {
  const numericValues = values
    .map((value) => value.trim())
    .filter((value) => value !== '' && value.toLowerCase() !== 'unknown')
    .map(Number)
    .filter(Number.isFinite)

  if (numericValues.length === 0) {
    return null
  }

  return numericValues.reduce((total, value) => total + value, 0) /
    numericValues.length
}

function getGenderCategory(gender: string): GenderCategory {
  const normalizedGender = gender.trim().toLowerCase()

  if (
    normalizedGender === 'male' ||
    normalizedGender === 'female' ||
    normalizedGender === 'n/a'
  ) {
    return normalizedGender
  }

  return 'unknown'
}

export function getGenderBreakdown(characters: Character[]): GenderBreakdown {
  const counts: GenderBreakdown = {
    male: 0,
    female: 0,
    'n/a': 0,
    unknown: 0,
  }

  characters.forEach((character) => {
    counts[getGenderCategory(character.gender)] += 1
  })

  return counts
}
