/* @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Character } from '../types/character'
import { fetchCharactersWithCache, fetchFilm } from './swapi'

const CACHE_KEY = 'starwars-geeks-characters-cache'
const characters: Character[] = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    gender: 'male',
    homeworld: 'https://swapi.info/api/planets/1',
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    created: '',
    edited: '',
    url: 'https://swapi.info/api/people/1',
  },
]

describe('fetchCharactersWithCache', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  describe('fetchFilm', () => {
    it('loads and validates film details', async () => {
      const film = {
        title: 'A New Hope',
        episode_id: 4,
        opening_crawl: 'A long time ago...',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        release_date: '1977-05-25',
        url: 'https://swapi.info/api/films/1',
        created: '',
        edited: '',
      }
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify(film), { status: 200 }),
        ),
      )

      await expect(fetchFilm(1)).resolves.toEqual(film)
    })

    it('rejects invalid IDs and malformed film data', async () => {
      await expect(fetchFilm(0)).rejects.toThrow(
        'Film ID must be a positive integer',
      )
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ title: 'Incomplete' }), { status: 200 }),
        ),
      )

      await expect(fetchFilm(1)).rejects.toThrow(
        'The film API returned data in an unexpected format',
      )
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('caches characters fetched from the network', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(characters), { status: 200 }),
      ),
    )

    await expect(fetchCharactersWithCache()).resolves.toMatchObject({
      characters,
      source: 'network',
      networkError: null,
      cacheWarning: null,
    })
    expect(JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? 'null')).toEqual(
      characters,
    )
  })

  it('uses the validated saved character list when the API is unavailable', async () => {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(characters))
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Offline')))

    await expect(fetchCharactersWithCache()).resolves.toMatchObject({
      characters,
      source: 'cache',
      networkError: 'Offline',
      cacheWarning: null,
    })
  })

  it('reports when saved data is malformed instead of hiding the API error', async () => {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify([{ name: 'Invalid' }]))
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Offline')))

    await expect(fetchCharactersWithCache()).rejects.toThrow(
      'Offline. The saved character data has an unexpected format.',
    )
  })
})
