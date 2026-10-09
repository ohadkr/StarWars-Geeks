export default function CharacterList({ characters, onSelectCharacter }) {
	return (
		<ul>
			{characters.map((character) => (
				<li key={character.url ?? character.name}>
					<button type="button" onClick={() => onSelectCharacter(character)}>
						{character.name}
					</button>
				</li>
			))}
		</ul>
	)
}
