# StarWars Geeks

StarWars Geeks is a responsive React application for exploring Star Wars characters. It uses React, TypeScript, Vite, and React Router to provide a character browser, detailed profiles, favorites, and statistics.

## Features

- **Character browser (Master–Detail):** Browse characters and open a detail page for each one.
- **Search, filtering, and sorting:** Filter by name, gender, film, species, or homeworld, and sort by name, height, or mass.
- **Character comparison:** Select two characters and compare their physical traits, birth year, gender, and homeworld.
- **Shareable comparisons:** Share a comparison using its URL, which preserves both selected characters.
- **Character details:** View character attributes and readable names for related films, planets, species, vehicles, and starships.
- **Similar characters:** Discover related characters based on shared films, species, or homeworld.
- **Film pages:** Open a film from a character profile to see its episode details, opening crawl, and characters.
- **Random discovery:** Pick a random character from the home page.
- **Favorites:** Add or remove characters from favorites; search, sort, and import/export the list as JSON. Selections persist in `localStorage`.
- **Statistics dashboard:** Compare character totals, average height and mass, and gender breakdowns for the full directory and favorites.
- **Theme:** Switch between light and dark modes; the preference persists in `localStorage` and follows the system theme by default.
- **Offline resilience:** Character data is cached locally when available, with retry controls and a visible notice when saved data is being shown.
- **Accessibility and motion:** Keyboard shortcuts support search and character navigation, focus indicators remain visible, and animations respect reduced-motion preferences.
- **Responsive layout:** The pages adapt to narrow mobile screens and wider desktop screens.

## Image Handling & Network Resilience

- **Primary visual source:** Character portraits load from GitHub Raw; film titles are resolved from SWAPI, and poster thumbnails are not currently displayed.
- **Fallback mechanism:** If a portrait is missing or unavailable, the app uses a unique DiceBear Bottts SVG avatar. If that also fails, an inline SVG placeholder keeps the layout clean.
- **Resilient UI:** These fallbacks are designed to avoid broken-image icons and keep character cards and detail pages visually stable when external image services are unavailable, including on restricted networks.

## Data source

Character and related-resource data is fetched from [SWAPI](https://swapi.info/api/people).

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Tests

Run the unit tests once:

```sh
npm run test
```

Open Vitest's interactive UI:

```sh
npm run test:ui
```

## Quality checks

```sh
npm run build
npm run lint
```
