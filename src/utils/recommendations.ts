import type { Character } from '../types/character'

export interface SimilarCharacter {
  character: Character
  reasons: string[]
}

export function getSimilarCharacters(
  selected: Character,
  characters: Character[],
  limit = 4,
): SimilarCharacter[] {
  return characters
    .filter((character) => character.url !== selected.url)
    .map((character) => {
      const reasons: string[] = []

      if (
        selected.homeworld &&
        selected.homeworld !== 'unknown' &&
        character.homeworld === selected.homeworld
      ) {
        reasons.push('Same homeworld')
      }
      if (
        selected.species.some((species) => character.species.includes(species))
      ) {
        reasons.push('Same species')
      }
      if (selected.films.some((film) => character.films.includes(film))) {
        reasons.push('Appears in the same films')
      }

      return { character, reasons }
    })
    .filter(({ reasons }) => reasons.length > 0)
    .sort(
      (first, second) =>
        second.reasons.length - first.reasons.length ||
        first.character.name.localeCompare(second.character.name, undefined, {
          sensitivity: 'base',
        }),
    )
    .slice(0, Math.max(0, limit))
}
