import type { Character } from '../types/character'

const PEOPLE_URL = 'https://swapi.info/api/people'
const CHARACTERS_CACHE_KEY = 'starwars-geeks-characters-cache'
const STARSHIPS_URL = 'https://swapi.info/api/starships'

export interface CharacterDirectoryResult {
  characters: Character[]
  source: 'network' | 'cache'
  networkError: string | null
  cacheWarning: string | null
}

export interface Film {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  url: string
  created: string
  edited: string
}

export interface Starship {
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  hyperdrive_rating: string
  MGLT: string
  starship_class: string
  pilots: string[]
  films: string[]
  created: string
  edited: string
  url: string
}

function isStarship(value: unknown): value is Starship {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.model === 'string' &&
    typeof value.manufacturer === 'string' &&
    typeof value.cost_in_credits === 'string' &&
    typeof value.length === 'string' &&
    typeof value.max_atmosphering_speed === 'string' &&
    typeof value.crew === 'string' &&
    typeof value.passengers === 'string' &&
    typeof value.cargo_capacity === 'string' &&
    typeof value.consumables === 'string' &&
    typeof value.hyperdrive_rating === 'string' &&
    typeof value.MGLT === 'string' &&
    typeof value.starship_class === 'string' &&
    Array.isArray(value.pilots) &&
    value.pilots.every((item: unknown) => typeof item === 'string') &&
    Array.isArray(value.films) &&
    value.films.every((item: unknown) => typeof item === 'string') &&
    typeof value.created === 'string' &&
    typeof value.edited === 'string' &&
    typeof value.url === 'string'
  )
}

function isFilm(value: unknown): value is Film {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    typeof value.episode_id === 'number' &&
    typeof value.opening_crawl === 'string' &&
    typeof value.director === 'string' &&
    typeof value.producer === 'string' &&
    typeof value.release_date === 'string' &&
    typeof value.url === 'string' &&
    typeof value.created === 'string' &&
    typeof value.edited === 'string'
  )
}

const stringFields: (keyof Character)[] = [
  'name',
  'height',
  'mass',
  'hair_color',
  'skin_color',
  'eye_color',
  'birth_year',
  'gender',
  'homeworld',
  'created',
  'edited',
  'url',
]

const listFields: (keyof Character)[] = [
  'films',
  'species',
  'vehicles',
  'starships',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isCharacter(value: unknown): value is Character {
  if (!isRecord(value)) {
    return false
  }
  return (
    stringFields.every((field) => typeof value[field] === 'string') &&
    listFields.every(
      (field) =>
        Array.isArray(value[field]) &&
        value[field].every((item: unknown) => typeof item === 'string'),
    )
  )
}

function ensureSuccessfulResponse(response: Response): void {
  if (!response.ok) {
    throw new Error(`Failed to fetch characters (${response.status})`)
  }
}

export async function fetchCharacters(
  signal?: AbortSignal,
): Promise<Character[]> {
  const response = await fetch(PEOPLE_URL, { signal })
  ensureSuccessfulResponse(response)

  const data: unknown = await response.json()

  if (!Array.isArray(data) || !data.every(isCharacter)) {
    throw new Error('The characters API returned data in an unexpected format')
  }

  return data
}

export async function fetchCharactersWithCache(
  signal?: AbortSignal,
): Promise<CharacterDirectoryResult> {
  try {
    const characters = await fetchCharacters(signal)
    let cacheWarning: string | null = null

    try {
      window.localStorage.setItem(
        CHARACTERS_CACHE_KEY,
        JSON.stringify(characters),
      )
    } catch (error: unknown) {
      cacheWarning = `Characters could not be saved for offline use: ${getErrorMessage(error)}`
    }

    return {
      characters,
      source: 'network',
      networkError: null,
      cacheWarning,
    }
  } catch (error: unknown) {
    if (signal?.aborted) {
      throw error
    }

    const networkError = getErrorMessage(error)
    let cachedData: string | null

    try {
      cachedData = window.localStorage.getItem(CHARACTERS_CACHE_KEY)
    } catch (storageError: unknown) {
      throw new Error(
        `${networkError}. Saved data could not be accessed: ${getErrorMessage(storageError)}`,
        { cause: storageError },
      )
    }

    if (cachedData === null) {
      throw error
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(cachedData)
    } catch (parseError: unknown) {
      throw new Error(
        `${networkError}. The saved character data is invalid and cannot be used.`,
        { cause: parseError },
      )
    }

    if (!Array.isArray(parsed) || !parsed.every(isCharacter)) {
      throw new Error(
        `${networkError}. The saved character data has an unexpected format.`,
        { cause: error },
      )
    }

    return {
      characters: parsed,
      source: 'cache',
      networkError,
      cacheWarning: null,
    }
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred'
}

export async function fetchCharacter(
  id: number,
  signal?: AbortSignal,
): Promise<Character> {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error('Character ID must be a positive integer')
  }

  const response = await fetch(`${PEOPLE_URL}/${id}`, { signal })
  ensureSuccessfulResponse(response)

  const data: unknown = await response.json()

  if (!isCharacter(data)) {
    throw new Error('The character API returned data in an unexpected format')
  }

  return data
}

export async function fetchFilm(
  id: number,
  signal?: AbortSignal,
): Promise<Film> {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error('Film ID must be a positive integer')
  }

  const response = await fetch(`https://swapi.info/api/films/${id}`, { signal })
  ensureSuccessfulResponse(response)

  const data: unknown = await response.json()
  if (!isFilm(data)) {
    throw new Error('The film API returned data in an unexpected format')
  }

  return data
}

export async function fetchFilms(signal?: AbortSignal): Promise<Film[]> {
  const response = await fetch('https://swapi.info/api/films', { signal })
  if (!response.ok) {
    throw new Error(`Failed to fetch films (${response.status})`)
  }

  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isFilm)) {
    throw new Error('The films API returned data in an unexpected format')
  }

  return data
}

export async function fetchStarships(
  signal?: AbortSignal,
): Promise<Starship[]> {
  const response = await fetch(STARSHIPS_URL, { signal })
  if (!response.ok) {
    throw new Error(`Failed to fetch starships (${response.status})`)
  }

  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isStarship)) {
    throw new Error('The starships API returned data in an unexpected format')
  }

  return data
}

export async function fetchStarship(
  id: number,
  signal?: AbortSignal,
): Promise<Starship> {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error('Starship ID must be a positive integer')
  }

  const response = await fetch(`${STARSHIPS_URL}/${id}`, { signal })
  if (!response.ok) {
    throw new Error(`Failed to fetch starship (${response.status})`)
  }

  const data: unknown = await response.json()
  if (!isStarship(data)) {
    throw new Error('The starship API returned data in an unexpected format')
  }

  return data
}

export async function fetchResourceName(
  url: string,
  signal?: AbortSignal,
): Promise<string> {
  let resourceUrl: URL

  try {
    resourceUrl = new URL(url)
  } catch {
    throw new Error('The related resource URL is invalid')
  }

  const match = resourceUrl.pathname.match(
    /^\/api\/(films|planets|species|starships|vehicles)\/\d+\/?$/,
  )

  if (
    resourceUrl.protocol !== 'https:' ||
    resourceUrl.hostname !== 'swapi.info' ||
    !match
  ) {
    throw new Error('The related resource URL is not a supported SWAPI URL')
  }

  const response = await fetch(resourceUrl.href, { signal })
  ensureSuccessfulResponse(response)

  const data: unknown = await response.json()
  if (!isRecord(data)) {
    throw new Error('The related resource returned data in an unexpected format')
  }

  const nameField = match[1] === 'films' ? 'title' : 'name'
  const name = data[nameField]

  if (typeof name !== 'string' || name.length === 0) {
    throw new Error(`The related ${match[1]} resource has no ${nameField}`)
  }

  return name
}
