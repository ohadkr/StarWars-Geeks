import { useState } from 'react'
import CharacterList from './components/CharacterList.jsx'
import CharacterDetails from './components/CharacterDetails.jsx'

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  return (
    <main className="app">
      <h1>Star Wars Characters</h1>
      <CharacterList onSelectCharacter={setSelectedCharacter} />
      <CharacterDetails character={selectedCharacter} />
    </main>
  )
}
