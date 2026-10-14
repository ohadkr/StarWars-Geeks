import type { Character } from '../types/character'

const PEOPLE_URL = 'https://swapi.info/api/people'

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
