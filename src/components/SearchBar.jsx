export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <input
      type="search"
      aria-label="Search characters by name"
      placeholder="Search characters"
      value={searchQuery}
      onChange={(event) => onSearchChange(event.target.value)}
    />
  )
}