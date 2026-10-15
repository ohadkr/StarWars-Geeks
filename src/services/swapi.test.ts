/* @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Character } from '../types/character'
import {
  fetchCharactersWithCache,
  fetchFilm,
  fetchFilms,
  fetchStarship,
  fetchStarships,
} from './swapi'

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

const starship = {
  name: 'Millennium Falcon',
  model: 'YT-1300 light freighter',
  manufacturer: 'Corellian Engineering Corporation',
  cost_in_credits: '100000',
  length: '34.37',
  max_atmosphering_speed: '1050',
  crew: '4',
  passengers: '6',
  cargo_capacity: '100000',
  consumables: '2 months',
  hyperdrive_rating: '0.5',
  MGLT: '75',
  starship_class: 'Light freighter',
  pilots: [],
  films: [],
  created: '',
  edited: '',
  url: 'https://swapi.info/api/starships/10',
}

describe('fetchCharactersWithCache', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  describe('starship API', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('loads and validates the full starship catalog', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify([starship]), { status: 200 }),
        ),
      )

      await expect(fetchStarships()).resolves.toEqual([starship])
      expect(fetch).toHaveBeenCalledWith(
        'https://swapi.info/api/starships',
        { signal: undefined },
      )
    })

    it('loads starship details by numeric ID', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify(starship), { status: 200 }),
        ),
      )

      await expect(fetchStarship(10)).resolves.toEqual(starship)
      expect(fetch).toHaveBeenCalledWith(
        'https://swapi.info/api/starships/10',
        { signal: undefined },
      )
    })

    it('rejects invalid IDs and malformed starship responses', async () => {
      await expect(fetchStarship(0)).rejects.toThrow(
        'Starship ID must be a positive integer',
      )

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify([{ name: 'Incomplete' }]), { status: 200 }),
        ),
      )

      await expect(fetchStarships()).rejects.toThrow(
        'The starships API returned data in an unexpected format',
      )
    })
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

    describe('fetchFilms', () => {
      it('loads and validates the full film catalog', async () => {
        const films = [
          {
            title: 'A New Hope',
            episode_id: 4,
            opening_crawl: 'A long time ago...',
            director: 'George Lucas',
            producer: 'Gary Kurtz',
            release_date: '1977-05-25',
            url: 'https://swapi.info/api/films/1',
            created: '',
            edited: '',
          },
        ]
        vi.stubGlobal(
          'fetch',
          vi.fn().mockResolvedValue(
            new Response(JSON.stringify(films), { status: 200 }),
          ),
        )

        await expect(fetchFilms()).resolves.toEqual(films)
      })

      it('rejects malformed film catalogs', async () => {
        vi.stubGlobal(
          'fetch',
          vi.fn().mockResolvedValue(
            new Response(JSON.stringify([{ title: 'Incomplete' }]), {
              status: 200,
            }),
          ),
        )

        await expect(fetchFilms()).rejects.toThrow(
          'The films API returned data in an unexpected format',
        )
      })
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
