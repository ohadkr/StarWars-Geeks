export function extractId(url?: string): string {
  return url?.match(/\/(\d+)\/?$/)?.[1] || ''
}

export function getCharacterId(url: string): string {
  const id = extractId(url)

  if (!id || !/^\d+$/.test(id)) {
    throw new Error(`Unable to extract character ID from URL: ${url}`)
  }

  return id
}
