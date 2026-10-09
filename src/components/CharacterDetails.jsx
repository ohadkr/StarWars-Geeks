export default function CharacterDetails({ character }) {
  if (!character) {
    return <p>Select a character to see their details</p>
  }

  return (
    <section aria-labelledby="character-details-heading">
      <h2 id="character-details-heading">{character.name}</h2>
      <dl>
        <dt>Height</dt>
        <dd>{character.height}</dd>
        <dt>Mass</dt>
        <dd>{character.mass}</dd>
        <dt>Hair color</dt>
        <dd>{character.hair_color}</dd>
        <dt>Birth year</dt>
        <dd>{character.birth_year}</dd>
        <dt>Gender</dt>
        <dd>{character.gender}</dd>
      </dl>
    </section>
  )
}