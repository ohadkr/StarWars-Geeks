import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import NetworkNotice from '../components/NetworkNotice'
import { useCharacterDirectory } from '../hooks/useCharacterDirectory'
import { fetchResourceName } from '../services/swapi'
import type { Character } from '../types/character'
import { extractId } from '../utils/character'
import './ComparePage.css'

const comparisonFields: { label: string; key: keyof Character }[] = [
  { label: 'Height', key: 'height' },
  { label: 'Mass', key: 'mass' },
  { label: 'Birth year', key: 'birth_year' },
  { label: 'Gender', key: 'gender' },
  { label: 'Hair color', key: 'hair_color' },
  { label: 'Skin color', key: 'skin_color' },
  { label: 'Eye color', key: 'eye_color' },
  { label: 'Homeworld', key: 'homeworld' },
]

function getComparisonValue(
  character: Character,
  key: keyof Character,
  homeworldNames: Record<string, string>,
): string {
  const value = character[key]
  if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length} listed` : 'None listed'
  }
  if (key === 'height' && /^\d+(?:\.\d+)?$/.test(value)) {
    return `${value} cm`
  }
  if (key === 'mass' && /^\d+(?:\.\d+)?$/.test(value)) {
    return `${value} kg`
  }
  if (key === 'homeworld' && value) {
    return homeworldNames[value] ?? 'Loading planet name...'
  }
  return value || 'Unknown'
}

function ComparePage() {
  const { state, retry } = useCharacterDirectory()
  const [searchParams, setSearchParams] = useSearchParams()
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const firstId = searchParams.get('first') ?? ''
  const secondId = searchParams.get('second') ?? ''

  const firstCharacter =
    state.status === 'success'
      ? state.characters.find((character) => extractId(character.url) === firstId)
      : undefined
  const secondCharacter =
    state.status === 'success' && secondId !== firstId
      ? state.characters.find((character) => extractId(character.url) === secondId)
      : undefined
  const validFirstId = firstCharacter ? firstId : ''
  const validSecondId = secondCharacter ? secondId : ''
  const firstHomeworld = firstCharacter?.homeworld ?? ''
  const secondHomeworld = secondCharacter?.homeworld ?? ''
  const [homeworldNames, setHomeworldNames] = useState<Record<string, string>>(
    {},
  )
  const shareUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}/compare?${new URLSearchParams({
          first: validFirstId,
          second: validSecondId,
        }).toString()}`

  function updateSelection(key: 'first' | 'second', value: string) {
    const nextParams = new URLSearchParams(searchParams)
    if (value) {
      nextParams.set(key, value)
    } else {
      nextParams.delete(key)
    }
    setSearchParams(nextParams, { replace: true })
    setShareMessage(null)
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareMessage('Comparison link copied.')
    } catch {
      setShareMessage('Copying is unavailable. Select and copy the link below.')
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const urls = [...new Set([firstHomeworld, secondHomeworld].filter(Boolean))]

    async function loadHomeworldNames() {
      const names = await Promise.all(
        urls.map(async (url) => {
          try {
            const name = await fetchResourceName(url, controller.signal)
            return [url, name] as const
          } catch {
            const planetId = extractId(url)
            return [url, planetId ? `Planet #${planetId}` : 'Unknown'] as const
          }
        }),
      )

      if (!controller.signal.aborted) {
        setHomeworldNames((currentNames) => ({
          ...currentNames,
          ...Object.fromEntries(names),
        }))
      }
    }

    void loadHomeworldNames()

    return () => controller.abort()
  }, [firstHomeworld, secondHomeworld])

  return (
    <section className="compare-page">
      <h1>Compare characters</h1>
      {state.status === 'loading' && (
        <p role="status">Loading characters...</p>
      )}
      {state.status === 'error' && (
        <NetworkNotice message={state.message} onRetry={retry} />
      )}
      {state.status === 'success' && (
        <>
          {state.networkError && (
            <NetworkNotice
              message={state.networkError}
              onRetry={retry}
              savedData={state.source === 'cache'}
            />
          )}
          {state.cacheWarning && (
            <p className="compare-page__notice" role="status">
              {state.cacheWarning}
            </p>
          )}
          <div className="compare-page__selectors">
            <label>
              <span>First character</span>
              <select
                value={validFirstId}
                onChange={(event) => updateSelection('first', event.currentTarget.value)}
              >
                <option value="">Choose a character</option>
                {state.characters
                  .filter((character) => extractId(character.url) !== secondId)
                  .map((character) => (
                    <option key={character.url} value={extractId(character.url)}>
                      {character.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              <span>Second character</span>
              <select
                value={validSecondId}
                onChange={(event) => updateSelection('second', event.currentTarget.value)}
              >
                <option value="">Choose a character</option>
                {state.characters
                  .filter((character) => extractId(character.url) !== firstId)
                  .map((character) => (
                    <option key={character.url} value={extractId(character.url)}>
                      {character.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          {firstCharacter && secondCharacter ? (
            <>
              <div className="compare-page__share">
                <label>
                  <span>Share this comparison</span>
                  <input type="url" readOnly value={shareUrl} />
                </label>
                <button type="button" onClick={() => void copyShareLink()}>
                  Copy link
                </button>
              </div>
              {shareMessage && (
                <p className="compare-page__notice" role="status">
                  {shareMessage}
                </p>
              )}
              <div className="compare-page__table-wrap">
                <table className="compare-page__table">
                  <thead>
                    <tr>
                      <th scope="col">Attribute</th>
                      <th scope="col">{firstCharacter.name}</th>
                      <th scope="col">{secondCharacter.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFields.map(({ label, key }) => (
                      <tr key={key}>
                        <th scope="row">{label}</th>
                        <td>
                          {getComparisonValue(firstCharacter, key, homeworldNames)}
                        </td>
                        <td>
                          {getComparisonValue(secondCharacter, key, homeworldNames)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="compare-page__empty" role="status">
              Select two different characters to compare their stats.
            </p>
          )}
        </>
      )}
    </section>
  )
}

export default ComparePage
