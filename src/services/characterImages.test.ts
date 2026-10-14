import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCharacterImage } from './characterImages'

describe('fetchCharacterImage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('looks up portraits by character name and reuses the image catalog', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              name: 'Luke Skywalker',
              image: 'https://images.example/luke.jpg',
            },
            {
              name: 'R2-D2',
              image: 'https://images.example/r2d2.jpg',
            },
            {
              name: 'Ratts Tyerell',
              image: 'https://images.example/ratts-tyerell.jpg',
            },
          ]),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            query: {
              pages: {},
            },
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ query: { pages: {} } }), { status: 200 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchCharacterImage('luke skywalker')).resolves.toBe(
      'https://images.example/luke.jpg',
    )
    await expect(fetchCharacterImage('R2-D2')).resolves.toBe(
      'https://images.example/r2d2.jpg',
    )
    await expect(fetchCharacterImage('Ratts Tyerel')).resolves.toBe(
      'https://static.wikia.nocookie.net/starwars/images/a/a5/RattsHS-SWE.png/revision/latest/scale-to-width-down/375?cb=20220910224708',
    )
    await expect(fetchCharacterImage('Adi Gallia')).resolves.toBe(
      'https://static.wikia.nocookie.net/starwars/images/f/f2/AdiGallia2-SWE.png/revision/latest/scale-to-width-down/434?cb=20240922163922',
    )
    await expect(fetchCharacterImage('Ben Quadinaros')).resolves.toBe(
      'https://static.wikia.nocookie.net/starwars/images/7/77/BenQuadinaros-CGSWG.png/revision/latest/scale-to-width-down/400?cb=20241124183127',
    )
    await expect(fetchCharacterImage('Wedge Antilles')).resolves.toBe(
      'https://static.wikia.nocookie.net/starwars/images/7/7e/WedgesEntireHead-ROTJ.png/revision/latest/scale-to-width-down/393?cb=20240914031530',
    )
    await expect(fetchCharacterImage('Wedge Antilles')).resolves.toBe(
      'https://static.wikia.nocookie.net/starwars/images/7/7e/WedgesEntireHead-ROTJ.png/revision/latest/scale-to-width-down/393?cb=20240914031530',
    )
    await expect(fetchCharacterImage('Unknown character')).resolves.toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
