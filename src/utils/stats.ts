import type { Character } from '../types/character'

export const genderCategories = ['male', 'female', 'n/a', 'unknown'] as const

export type GenderCategory = (typeof genderCategories)[number]

export type GenderBreakdown = Record<GenderCategory, number>

export function filterCharactersByName(
  characters: Character[],
  query: string,
): Character[] {
  const normalizedQuery = query.trim().toLowerCase()

  return characters.filter((character) =>
    character.name.toLowerCase().includes(normalizedQuery),
  )
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
