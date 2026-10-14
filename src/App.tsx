import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { FavoritesProvider } from './context/FavoritesProvider'
import { useFavorites } from './context/useFavorites'
import CharacterDetailPage from './pages/CharacterDetailPage'
import ComparePage from './pages/ComparePage'
import FavoritesPage from './pages/FavoritesPage'
import FilmDetailPage from './pages/FilmDetailPage'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'
import './App.css'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  error: string | null
}

function getInitialTheme(): ThemeState {
  try {
    const storedTheme = window.localStorage.getItem('starwars-geeks-theme')
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return { theme: storedTheme, error: null }
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown storage error'
    return {
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
      error: `Theme preference could not be loaded: ${message}`,
    }
  }

  return {
    theme: window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    error: null,
  }
}

function AppLayout() {
  const { storageError } = useFavorites()
  const [themeState, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = themeState.theme
  }, [themeState.theme])

  function toggleTheme() {
    const theme = themeState.theme === 'dark' ? 'light' : 'dark'
    try {
      window.localStorage.setItem('starwars-geeks-theme', theme)
      setThemeState({ theme, error: null })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown storage error'
      setThemeState({
        theme,
        error: `Theme preference could not be saved: ${message}`,
      })
    }
  }

  return (
    <div className="app">
      <Navbar
        theme={themeState.theme}
        onToggleTheme={toggleTheme}
      />
      {storageError && (
        <p className="favorites-storage-error" role="alert">
          {storageError}
        </p>
      )}
      {themeState.error && (
        <p className="favorites-storage-error" role="alert">
          {themeState.error}
        </p>
      )}
      <main className="app__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/film/:id" element={<FilmDetailPage />} />
          <Route path="/character/:id" element={<CharacterDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <AppLayout />
      </FavoritesProvider>
    </BrowserRouter>
  )
}

export default App
