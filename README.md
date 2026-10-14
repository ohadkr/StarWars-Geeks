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
- **Film directory:** Browse all six films in episode order, with theatrical posters and links to film details.
- **Random discovery:** Pick a random character from the home page.
- **Favorites:** Add or remove characters from favorites; search, sort, and import/export the list as JSON. Selections persist in `localStorage`.
- **Statistics dashboard:** Compare character totals, average height and mass, and gender breakdowns for the full directory and favorites.
- **Theme:** Switch between light and dark modes; the preference persists in `localStorage` and follows the system theme by default.
- **Offline resilience:** Character data is cached locally when available, with retry controls and a visible notice when saved data is being shown.
- **Accessibility and motion:** Keyboard shortcuts support search and character navigation, focus indicators remain visible, and animations respect reduced-motion preferences.
- **Responsive layout:** The pages adapt to narrow mobile screens and wider desktop screens.

## Image Handling & Network Resilience

- **Primary visual source:** Character portraits are matched by character name against the [Star Wars API image catalog](https://akabab.github.io/starwars-api/api/all.json); film titles are resolved from SWAPI.
- **Film posters:** Posters for all six films are displayed beside film names in the home-page film filter, character details, and film pages. Images load directly from the official [StarWars.com image CDN](https://lumiere-a.akamaihd.net/).
- **Fallback mechanism:** If a portrait is missing or its image has expired, the app searches the Star Wars Fandom image catalog before showing an inline SVG placeholder.
- **Resilient UI:** Character cards and detail pages remain stable when image sources are unavailable, without using robot avatars.

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
