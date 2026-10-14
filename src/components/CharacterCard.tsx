import { Link } from 'react-router-dom'
import CharacterAvatar from './CharacterAvatar'
import { useFavorites } from '../context/useFavorites'
import type { Character } from '../types/character'
import { extractId } from '../utils/character'
import './CharacterCard.css'

interface CharacterCardProps {
  character: Character
}

function CharacterCard({ character }: CharacterCardProps) {
  const characterId = extractId(character.url)
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(character)

  return (
    <article className="character-card">
      <div className="character-card__header">
        <div className="character-card__identity">
          <CharacterAvatar
            key={characterId}
            characterName={character.name}
            size="thumbnail"
          />
          <Link
            className="character-card__character-link"
            to={`/character/${characterId}`}
            aria-label={`View details for ${character.name}`}
          >
            <h2 className="character-card__name">{character.name}</h2>
          </Link>
        </div>
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
