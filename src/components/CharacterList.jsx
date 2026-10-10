export default function CharacterList({
	characters,
	onSelectCharacter,
	selectedCharacter,
	favorites,
	onToggleFavorite,
}) {
	const activeCharacter = characters.includes(selectedCharacter) ? selectedCharacter : characters[0]

	return (
		<ul
			className="character-list"
			onKeyDown={(event) => {
				if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
					return
				}

				const characterButtons = Array.from(
					event.currentTarget.querySelectorAll('.character-list__button'),
				)
				if (characterButtons.length === 0 || !event.target.matches('.character-list__button')) {
					return
				}

				const currentIndex = characterButtons.indexOf(event.target)
				let nextIndex = currentIndex
				if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % characterButtons.length
				if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + characterButtons.length) % characterButtons.length
				if (event.key === 'Home') nextIndex = 0
				if (event.key === 'End') nextIndex = characterButtons.length - 1

				event.preventDefault()
				onSelectCharacter(characters[nextIndex])
				characterButtons[nextIndex].focus()
			}}
		>
			{characters.length === 0 ? (
				<li className="character-list__empty">No characters found.</li>
			) : characters.map((character) => (
				<li className="character-list__item" key={character.url ?? character.name}>
					<div className="character-list__row">
						<button
							className={`character-list__button${selectedCharacter === character ? ' is-selected' : ''}`}
							type="button"
							tabIndex={character === activeCharacter ? 0 : -1}
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
