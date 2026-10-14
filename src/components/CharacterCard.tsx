import { Link } from 'react-router-dom'
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

  return (
    <Link
      className="character-card"
      to={`/character/${characterId}`}
      aria-label={`View details for ${character.name}`}
    >
      <h2 className="character-card__name">{character.name}</h2>
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
  )
}

export default CharacterCard
