import items from '../data/items.json';

export default function CharacterList() {
	return (
		<ul>
			{items.map((character) => (
				<li key={character.id}>{character.name}</li>
			))}
		</ul>
	)
}
