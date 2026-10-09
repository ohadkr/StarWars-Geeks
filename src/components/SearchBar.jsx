export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <label className="search-field">
      <span className="visually-hidden">Search characters by name</span>
      <input
        className="search-field__input"
        type="search"
        placeholder="Search characters"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <span className="search-field__shortcut" aria-hidden="true">/</span>
    </label>
  )
}