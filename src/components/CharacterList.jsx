export default function CharacterList({
	characters,
	onSelectCharacter,
	selectedCharacter,
	favorites,
	onToggleFavorite,
}) {
	return (
		<ul className="character-list">
			{characters.length === 0 ? (
				<li className="character-list__empty">No characters found.</li>
			) : characters.map((character) => (
				<li className="character-list__item" key={character.url ?? character.name}>
					<div className="character-list__row">
						<button
							className={`character-list__button${selectedCharacter === character ? ' is-selected' : ''}`}
							type="button"
							aria-pressed={selectedCharacter === character}
							onClick={() => onSelectCharacter(character)}
						>
							<span className="character-list__marker" aria-hidden="true" />
							{character.name}
						</button>
						<button
							className={`favorite-button${favorites.includes(character.name) ? ' is-favorite' : ''}`}
							type="button"
							aria-label={`${favorites.includes(character.name) ? 'Remove' : 'Add'} ${character.name} ${favorites.includes(character.name) ? 'from' : 'to'} favorites`}
							aria-pressed={favorites.includes(character.name)}
							title={`${favorites.includes(character.name) ? 'Remove from' : 'Add to'} favorites`}
							onClick={() => onToggleFavorite(character.name)}
						>
							{favorites.includes(character.name) ? '\u2605' : '\u2606'}
						</button>
					</div>
				</li>
			))}
		</ul>
	)
}
