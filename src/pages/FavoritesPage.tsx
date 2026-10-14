import CharacterCard from '../components/CharacterCard'
import { useFavorites } from '../context/useFavorites'

function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <section className="favorites-page">
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <p className="favorites-page__empty">
          You haven&apos;t added any characters to your favorites yet.
        </p>
      ) : (
        <div className="character-grid">
          {favorites.map((character) => (
            <CharacterCard key={character.url} character={character} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoritesPage
