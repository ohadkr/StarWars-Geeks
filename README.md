# StarWars Geeks

StarWars Geeks is a responsive React application for exploring Star Wars characters. It uses React, TypeScript, Vite, and React Router to provide a character browser, detailed profiles, favorites, and statistics.

## Features

- **Character browser (Master–Detail):** Browse characters and open a detail page for each one.
- **Search and filtering:** Filter the character list by name as you type.
- **Character details:** View character attributes and readable names for related films, planets, species, vehicles, and starships.
- **Favorites:** Add or remove characters from favorites; selections persist in `localStorage`.
- **Statistics dashboard:** View character and favorite counts, average height and mass, and a gender breakdown.
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
