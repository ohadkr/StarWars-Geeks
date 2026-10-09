export default function CharacterList({ characters, onSelectCharacter, selectedCharacter }) {
	return (
		<ul className="character-list">
			{characters.length === 0 ? (
				<li className="character-list__empty">No characters found.</li>
			) : characters.map((character) => (
				<li className="character-list__item" key={character.url ?? character.name}>
					<button
						className={`character-list__button${selectedCharacter === character ? ' is-selected' : ''}`}
						type="button"
						aria-pressed={selectedCharacter === character}
						onClick={() => onSelectCharacter(character)}
					>
						<span className="character-list__marker" aria-hidden="true" />
						{character.name}
					</button>
				</li>
			))}
		</ul>
	)
}
