const CHARACTER_IMAGES_URL =
  'https://akabab.github.io/starwars-api/api/all.json'

interface CharacterImage {
  name: string
  image: string
}

const CHARACTER_IMAGE_ALIASES: Record<string, string> = {
  'ratts tyerel': 'ratts tyerell',
}

const CHARACTER_IMAGE_OVERRIDES: Record<string, string> = {
  'adi gallia':
    'https://static.wikia.nocookie.net/starwars/images/f/f2/AdiGallia2-SWE.png/revision/latest/scale-to-width-down/434?cb=20240922163922',
  'ben quadinaros':
    'https://static.wikia.nocookie.net/starwars/images/7/77/BenQuadinaros-CGSWG.png/revision/latest/scale-to-width-down/400?cb=20241124183127',
  'cordé':
    'https://static.wikia.nocookie.net/starwars/images/e/e5/Corde-SWCT.png/revision/latest/scale-to-width-down/453?cb=20251107042546',
  'dexter jettster':
    'https://static.wikia.nocookie.net/starwars/images/1/1c/DexterHS-SWE.png/revision/latest/scale-to-width-down/375?cb=20241126014343',
  dormé:
    'https://static.wikia.nocookie.net/starwars/images/9/93/Dorme-CGSWG.png/revision/latest/scale-to-width-down/417?cb=20250106045359',
  gasgano:
    'https://static.wikia.nocookie.net/starwars/images/a/a4/GasganoHS-SWE.png/revision/latest/scale-to-width-down/378?cb=20211212055452',
  'gregar typho':
    'https://static.wikia.nocookie.net/starwars/images/2/26/CaptainTypho-2024ToppsSWHyperspace.png/revision/latest/scale-to-width-down/375?cb=20251027042728',
  'grievous':
    'https://static.wikia.nocookie.net/starwars/images/c/ca/Grievoushead-OP.png/revision/latest/scale-to-width-down/375?cb=20241118021232',
  lobot:
    'https://static.wikia.nocookie.net/starwars/images/7/72/Lobot-SWE.png/revision/latest/scale-to-width-down/428?cb=20211214014446',
  'luminara unduli':
    'https://static.wikia.nocookie.net/starwars/images/9/91/LuminaraUnduli-Encyclopedia.png/revision/latest/scale-to-width-down/500?cb=20180206232118',
  'mace windu':
    'https://static.wikia.nocookie.net/starwars/images/4/41/Mace_Windu_SWI38.png/revision/latest/scale-to-width-down/346?cb=20221004010251',
  'mon mothma':
    'https://static.wikia.nocookie.net/starwars/images/c/c8/MonMothma-RotJAVA.png/revision/latest/scale-to-width-down/375?cb=20250424135205',
  'ratts tyerel':
    'https://static.wikia.nocookie.net/starwars/images/a/a5/RattsHS-SWE.png/revision/latest/scale-to-width-down/375?cb=20220910224708',
  'roos tarpals':
    'https://static.wikia.nocookie.net/starwars/images/c/c8/Tarpals-FFp47.png/revision/latest/scale-to-width-down/471?cb=20251027033148',
  'rugor nass':
    'https://static.wikia.nocookie.net/starwars/images/f/f0/Bossnass.png/revision/latest/scale-to-width-down/396?cb=20251109162131',
  'saesee tiin':
    'https://static.wikia.nocookie.net/starwars/images/a/a3/SaeseeTiin-SWCT.png/revision/latest/scale-to-width-down/375?cb=20251129194602',
  'san hill':
    'https://static.wikia.nocookie.net/starwars/images/6/63/SanHill-BaseSeries5.png/revision/latest/scale-to-width-down/348?cb=20251107064755',
  'shmi skywalker':
    'https://static.wikia.nocookie.net/starwars/images/6/6c/ShmiSkywalkerLars-Databank.jpg/revision/latest/scale-to-width-down/365?cb=20171114023541',
  'sly moore':
    'https://static.wikia.nocookie.net/starwars/images/b/b7/SlyMooreStare-OP.png/revision/latest/scale-to-width-down/397?cb=20211214041804',
  'tion medon':
    'https://static.wikia.nocookie.net/starwars/images/1/16/TionMedon-SWI90.png/revision/latest/scale-to-width-down/394?cb=20230915013119',
  'wedge antilles':
    'https://static.wikia.nocookie.net/starwars/images/7/7e/WedgesEntireHead-ROTJ.png/revision/latest/scale-to-width-down/393?cb=20240914031530',
  'yarael poof':
    'https://static.wikia.nocookie.net/starwars/images/b/b2/YaraelPoof-SWCT.png/revision/latest/scale-to-width-down/376?cb=20251107071536',
}

let characterImagesPromise: Promise<Map<string, string>> | null = null
const fallbackImagePromises = new Map<string, Promise<string | null>>()

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getCharacterImage(value: unknown): CharacterImage | null {
  if (
    !isRecord(value) ||
    typeof value.name !== 'string' ||
    typeof value.image !== 'string'
  ) {
    return null
  }

  try {
    const imageUrl = new URL(value.image)
    if (imageUrl.protocol !== 'https:') {
      return null
    }
  } catch {
    return null
  }

  return { name: value.name, image: value.image }
}

function fetchCharacterImages(): Promise<Map<string, string>> {
  return fetch(CHARACTER_IMAGES_URL).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch character images (${response.status})`)
    }

    const data: unknown = await response.json()
    if (!Array.isArray(data)) {
      throw new Error('The character images API returned an unexpected format')
    }

    const images = new Map<string, string>()
    for (const item of data) {
      const characterImage = getCharacterImage(item)
      if (characterImage) {
        images.set(characterImage.name.trim().toLowerCase(), characterImage.image)
      }
    }

    if (images.size === 0) {
      throw new Error('The character images API returned no usable portraits')
    }

    return images
  })
}

function getFallbackImage(data: unknown): string | null {
  if (!isRecord(data) || !isRecord(data.query) || !isRecord(data.query.pages)) {
    throw new Error('The character image search returned an unexpected format')
  }

  for (const page of Object.values(data.query.pages)) {
    if (!isRecord(page) || !isRecord(page.thumbnail)) {
      continue
    }

    const image = page.thumbnail.source
    if (typeof image !== 'string') {
      continue
    }

    try {
      const imageUrl = new URL(image)
      if (
        imageUrl.protocol === 'https:' &&
        imageUrl.hostname === 'static.wikia.nocookie.net'
      ) {
        return imageUrl.href
      }
    } catch {
      continue
    }
  }

  return null
}

export function fetchFallbackCharacterImage(
  characterName: string,
): Promise<string | null> {
  const normalizedName = characterName.trim().toLowerCase()
  const imageName = CHARACTER_IMAGE_ALIASES[normalizedName] ?? normalizedName
  const cachedImage = fallbackImagePromises.get(imageName)
  if (cachedImage) {
    return cachedImage
  }

  const searchUrl = new URL('https://starwars.fandom.com/api.php')
  searchUrl.search = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: imageName,
    gsrnamespace: '0',
    gsrlimit: '1',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '500',
    format: 'json',
    origin: '*',
  }).toString()

  const request = fetch(searchUrl).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Failed to search for a character portrait (${response.status})`)
    }

    return getFallbackImage(await response.json())
  })

  const cachedRequest = request.catch((error: unknown) => {
    fallbackImagePromises.delete(imageName)
    throw error
  })
  fallbackImagePromises.set(imageName, cachedRequest)
  return cachedRequest
}

export function fetchCharacterImage(
  characterName: string,
): Promise<string | null> {
  if (characterImagesPromise === null) {
    characterImagesPromise = fetchCharacterImages().catch((error: unknown) => {
      characterImagesPromise = null
      throw error
    })
  }

  const imageName = characterName.trim().toLowerCase()

  return characterImagesPromise.then(async (images) => {
    const override = CHARACTER_IMAGE_OVERRIDES[imageName]
    if (override) {
      return override
    }

    const catalogName = CHARACTER_IMAGE_ALIASES[imageName] ?? imageName
    const imageUrl = images.get(catalogName)
    return imageUrl ?? fetchFallbackCharacterImage(characterName)
  })
}
