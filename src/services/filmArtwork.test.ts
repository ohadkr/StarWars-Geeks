import { describe, expect, it } from 'vitest'
import { getFilmPosterUrl } from './filmArtwork'

describe('getFilmPosterUrl', () => {
  it('maps SWAPI film IDs to the corresponding theatrical posters', () => {
    const expectedPosterNames = [
      'New-Hope-IV',
      'Empire-Strikes-Back-V',
      'Return-Jedi-VI',
      'Phantom-Menace-I',
      'Attack-Clones-II',
      'Revenge-Sith-III',
    ]

    expectedPosterNames.forEach((posterName, index) => {
      expect(getFilmPosterUrl(String(index + 1))).toContain(posterName)
    })
  })

  it('returns null for unknown film IDs', () => {
    expect(getFilmPosterUrl('7')).toBeNull()
  })
})
