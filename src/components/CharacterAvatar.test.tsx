/* @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CharacterAvatar from './CharacterAvatar'

describe('CharacterAvatar', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('loads a replacement portrait when the catalog image is unavailable', async () => {
    const primaryImage = 'https://images.example/expired.jpg'
    const fallbackImage = 'https://static.wikia.nocookie.net/replacement.jpg'
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            { name: 'Luke Skywalker', image: primaryImage },
          ]),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            query: {
              pages: {
                1: {
                  title: 'Unknown character',
                  thumbnail: { source: fallbackImage },
                },
              },
            },
          }),
          { status: 200 },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    render(
      <CharacterAvatar characterName="Luke Skywalker" size="thumbnail" />,
    )

    const image = await screen.findByRole('img', { name: 'Luke Skywalker' })
    await waitFor(() => expect(image.getAttribute('src')).toBe(primaryImage))
    fireEvent.error(image)
    await waitFor(() => expect(image.getAttribute('src')).toBe(fallbackImage))
  })

  it('uses a replacement portrait when the primary catalog is unavailable', async () => {
    const fallbackImage = 'https://static.wikia.nocookie.net/ratts.jpg'
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Catalog unavailable'))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            query: {
              pages: {
                1: {
                  title: 'Ratts Tyerell',
                  thumbnail: { source: fallbackImage },
                },
              },
            },
          }),
          { status: 200 },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    render(<CharacterAvatar characterName="Unknown character" size="thumbnail" />)

    const image = await screen.findByRole('img', { name: 'Unknown character' })
    await waitFor(() => expect(image.getAttribute('src')).toBe(fallbackImage))
  })
})
