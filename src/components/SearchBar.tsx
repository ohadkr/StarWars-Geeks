import './SearchBar.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-bar">
      <span className="search-bar__label">Search characters by name</span>
      <input
        className="search-bar__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder="e.g. Luke Skywalker"
      />
    </label>
  )
}

export default SearchBar
