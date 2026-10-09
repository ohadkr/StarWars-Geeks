import items from '../data/items.json';

export default function CharacterList({ onSelectCharacter }) {
	return (
		<ul>
			{items.map((character) => (
				<li key={character.id}>
					<button type="button" onClick={() => onSelectCharacter(character)}>
						{character.name}
					</button>
				</li>
			))}
		</ul>
	)
}
