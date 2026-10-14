import { Link } from 'react-router-dom'
import { useFavorites } from '../context/useFavorites'
import type { Character } from '../types/character'
import './CharacterCard.css'

interface CharacterCardProps {
  character: Character
}

function getCharacterId(url: string): string {
  const id = url.match(/\/people\/(\d+)\/?$/)?.[1]

  if (!id) {
    throw new Error(`Unable to extract character ID from URL: ${url}`)
  }

  return id
}

function CharacterCard({ character }: CharacterCardProps) {
  const characterId = getCharacterId(character.url)
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(character)

  return (
    <article className="character-card">
      <div className="character-card__header">
        <Link
          className="character-card__character-link"
          to={`/character/${characterId}`}
          aria-label={`View details for ${character.name}`}
        >
          <h2 className="character-card__name">{character.name}</h2>
        </Link>
        <button
          className="character-card__favorite"
          type="button"
          aria-pressed={favorite}
          aria-label={
            favorite
              ? `Remove ${character.name} from favorites`
              : `Add ${character.name} to favorites`
          }
          onClick={() => toggleFavorite(character)}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>
      <Link
        className="character-card__details-link"
        to={`/character/${characterId}`}
        aria-label={`View details for ${character.name}`}
      >
        <dl className="character-card__details">
          <div>
            <dt>Gender</dt>
            <dd>{character.gender}</dd>
          </div>
          <div>
            <dt>Birth year</dt>
            <dd>{character.birth_year}</dd>
          </div>
        </dl>
      </Link>
    </article>
  )
}

export default CharacterCard
