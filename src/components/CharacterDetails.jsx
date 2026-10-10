const filmTitles = {
  1: 'A New Hope',
  2: 'The Empire Strikes Back',
  3: 'Return of the Jedi',
  4: 'The Phantom Menace',
  5: 'Attack of the Clones',
  6: 'Revenge of the Sith',
}

export default function CharacterDetails({ character, favorites, onToggleFavorite }) {
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
      <div className="details-panel__title-row">
        <h2 id="character-details-heading">{character.name}</h2>
        <button
          className={`favorite-button favorite-button--large${favorites.includes(character.name) ? ' is-favorite' : ''}`}
          type="button"
          aria-label={`${favorites.includes(character.name) ? 'Remove' : 'Add'} ${character.name} ${favorites.includes(character.name) ? 'from' : 'to'} favorites`}
          aria-pressed={favorites.includes(character.name)}
          title={`${favorites.includes(character.name) ? 'Remove from' : 'Add to'} favorites`}
          onClick={() => onToggleFavorite(character.name)}
        >
          {favorites.includes(character.name) ? '\u2605' : '\u2606'}
        </button>
      </div>
      <p className="details-panel__subtitle">PERSONNEL RECORD</p>
      <dl className="character-facts">
        <div className="character-fact"><dt>Height</dt><dd>{character.height}<span> cm</span></dd></div>
        <div className="character-fact"><dt>Mass</dt><dd>{character.mass}<span> kg</span></dd></div>
        <div className="character-fact"><dt>Hair color</dt><dd>{character.hair_color}</dd></div>
        <div className="character-fact"><dt>Birth year</dt><dd>{character.birth_year}</dd></div>
        <div className="character-fact"><dt>Gender</dt><dd>{character.gender}</dd></div>
        <div className="character-fact"><dt>Eye color</dt><dd>{character.eye_color}</dd></div>
        <div className="character-fact"><dt>Skin color</dt><dd>{character.skin_color}</dd></div>
        <div className="character-fact character-fact--films">
          <dt>Films</dt>
          <dd>
            {character.films?.length ? (
              <ul className="film-list">
                {character.films.map((filmUrl, index) => {
                  const filmNumber = filmUrl.match(/\/films\/(\d+)\/?$/)?.[1]
                  const filmTitle = filmTitles[filmNumber] ?? `Film ${index + 1}`

                  return (
                    <li key={filmUrl}>
                      <span className="film-list__title">{filmTitle}</span>
                    </li>
                  )
                })}
              </ul>
            ) : 'No film appearances listed'}
          </dd>
        </div>
      </dl>
    </section>
  )
}