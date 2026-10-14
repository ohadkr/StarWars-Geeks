import type { RefObject } from 'react'
import './SearchBar.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
}

function SearchBar({ value, onChange, inputRef }: SearchBarProps) {
  return (
    <label className="search-bar">
      <span className="search-bar__label">Search characters by name</span>
      <input
        className="search-bar__input"
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder="e.g. Luke Skywalker"
      />
    </label>
  )
}

export default SearchBar
