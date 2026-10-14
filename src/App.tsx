import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import { FavoritesProvider } from './context/FavoritesProvider'
import { useFavorites } from './context/useFavorites'
import CharacterDetailPage from './pages/CharacterDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import StatsPage from './pages/StatsPage'
import './App.css'

function AppLayout() {
  const { storageError } = useFavorites()

  return (
    <div className="app">
      <Navbar />
      {storageError && (
        <p className="favorites-storage-error" role="alert">
          {storageError}
        </p>
      )}
      <main className="app__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/stats" element={<StatsPage />} />
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
