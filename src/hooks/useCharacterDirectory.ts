import { useEffect, useState } from 'react'
import {
  fetchCharactersWithCache,
  type CharacterDirectoryResult,
} from '../services/swapi'

export type CharacterDirectoryState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | ({ status: 'success' } & CharacterDirectoryResult)

export function useCharacterDirectory() {
  const [attempt, setAttempt] = useState(0)
  const [loadedState, setLoadedState] = useState<{
    attempt: number
    state: CharacterDirectoryState
  }>({
    attempt: 0,
    state: { status: 'loading' },
  })

  useEffect(() => {
    const controller = new AbortController()

    async function loadCharacters() {
      try {
        const result = await fetchCharactersWithCache(controller.signal)
        setLoadedState({
          attempt,
          state: { status: 'success', ...result },
        })
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'An unexpected error occurred'
        setLoadedState({ attempt, state: { status: 'error', message } })
      }
    }

    void loadCharacters()

    return () => controller.abort()
  }, [attempt])

  const state =
    loadedState.attempt === attempt
      ? loadedState.state
      : ({ status: 'loading' } as const)

  return {
    state,
    retry: () => setAttempt((currentAttempt) => currentAttempt + 1),
  }
}
