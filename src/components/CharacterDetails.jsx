export default function CharacterDetails({ character }) {
  if (!character) {
    return (
      <section className="details-panel details-panel--empty" aria-live="polite">
        <span className="details-panel__orbit" aria-hidden="true">*</span>
        <p className="panel-kicker">CHARACTER DOSSIER</p>
        <p className="details-placeholder">Select a character to see their details</p>
      </section>
    )
  }

  return (
    <section className="details-panel" aria-labelledby="character-details-heading">
      <p className="panel-kicker">CHARACTER DOSSIER</p>
      <h2 id="character-details-heading">{character.name}</h2>
      <p className="details-panel__subtitle">PERSONNEL RECORD</p>
      <dl className="character-facts">
        <div className="character-fact"><dt>Height</dt><dd>{character.height}<span> cm</span></dd></div>
        <div className="character-fact"><dt>Mass</dt><dd>{character.mass}<span> kg</span></dd></div>
        <div className="character-fact"><dt>Hair color</dt><dd>{character.hair_color}</dd></div>
        <div className="character-fact"><dt>Birth year</dt><dd>{character.birth_year}</dd></div>
        <div className="character-fact"><dt>Gender</dt><dd>{character.gender}</dd></div>
      </dl>
    </section>
  )
}