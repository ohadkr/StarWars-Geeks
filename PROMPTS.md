# יומן פרומפטים

## 2026-10-14

**17:03 · copilot**

> Please complete Task 1 from tasks.md: 'Setup React Router and Navbar'.
> 
> Here are the specific instructions:
> 
> 1. Set up React Router (`BrowserRouter`, `Routes`, `Route`) in `src/App.tsx` (or `src/main.tsx`).
> 2. Create placeholder page components in a new folder `src/pages/`:
> 
> - `HomePage.tsx` (heading: 'Home - StarWars Geeks')
> - `FavoritesPage.tsx` (heading: 'Favorites')
> - `StatsPage.tsx` (heading: 'Statistics')
> - `CharacterDetailPage.tsx` (heading: 'Character Details')
> 3. Create a `Navbar` component in `src/components/Navbar.tsx` using `NavLink` from `react-router-dom` to navigate between:
> 
> - Home (`/`)
> - Favorites (`/favorites`)
> - Statistics (`/stats`)
> 4. Ensure active navigation links are styled or distinct using `NavLink`.
> 5. Ensure clean TypeScript typing with NO `any` types.

## 2026-10-14

**17:13 · copilot**

> Please complete Task 2 from tasks.md: 'Fetch data and setup TypeScript interfaces'.
> 
> Here are the specific instructions:
> 
> 1. Create a TypeScript interface/type in `src/types/character.ts` for the character object returned from SWAPI (`[https://swapi.info/api/people](https://swapi.info/api/people)`). Include fields like `name`, `height`, `mass`, `hair_color`, `skin_color`, `eye_color`, `birth_year`, `gender`, `url`, etc. Do NOT use `any`.
> 2. Create an API service or helper function in `src/services/swapi.ts` to fetch all characters from `[https://swapi.info/api/people](https://swapi.info/api/people)`.
> 3. In `src/pages/HomePage.tsx`, fetch the character data on component mount (`useEffect`).
> 4. Manage 3 distinct UI states in `HomePage`:
> 
> - **Loading state:** Display a clear loading indicator/message.
> - **Error state:** Display an error message if the fetch fails.
> - **Success state:** Display a simple list of character names.
> 5. Make sure no TypeScript errors occur and no `any` types are used.

## 2026-10-14

**17:25 · copilot**

> Please complete Task 3 from tasks.md: 'Build Home Page (Master view) and search'.
> 
> Here are the specific instructions:
> 
> 1. Create a `CharacterCard.tsx` component in `src/components/` to display basic character info (name, gender, birth year) in a clean card layout.
> 2. Create a `SearchBar.tsx` component in `src/components/` that lets users filter the displayed characters by name in real-time (case-insensitive).
> 3. Update `HomePage.tsx` to render the filtered list using `CharacterCard` in a responsive grid.
> 4. Ensure every card rendered in a list has a unique `key` prop.
> 5. Make each card clickable, so clicking it navigates to `/character/:id` using React Router `Link` or `useNavigate`. Create a helper function if needed to extract the character ID from the SWAPI `url` property.
> 6. Keep clean TypeScript typing with NO `any` types.

**17:31 · copilot**

> Please complete Task 4 from tasks.md: 'Build Character Detail page (Detail view)'.
> 
> Here are the specific instructions:
> 
> 1. In `src/pages/CharacterDetailPage.tsx`, use `useParams` from `react-router-dom` to extract the character `id` from the URL route `/character/:id`.
> 2. Fetch the specific character details from `[https://swapi.info/api/people/:id](https://swapi.info/api/people/:id)` or find the character from the list.
> 3. Manage Loading, Error, and Success states for the detail page.
> 4. Display all available character information in a clean, readable layout (e.g., Name, Height, Mass, Hair Color, Eye Color, Birth Year, Gender, etc.).
> 5. Add a 'Back to List' button/link using `Link` or `useNavigate` to easily navigate back to the home page (`/`).
> 6. Ensure strict TypeScript typing with NO `any` types.

**17:37 · copilot**

> Please complete Task 5 from tasks.md: 'Develop Favorites page and localStorage handling'.
> 
> Here are the specific instructions:
> 
> 1. Create a custom hook or context in `src/context/FavoritesContext.tsx` (or `src/hooks/useFavorites.ts`) to manage favorite character IDs or objects across the app.
> 2. Persist the favorites array in `localStorage` so favorites remain saved after refreshing the browser.
> 3. Add a favorite/star toggle button to `CharacterCard` and/or `CharacterDetailPage` allowing users to add or remove characters from favorites.
> 4. In `src/pages/FavoritesPage.tsx` (`/favorites`), render a list/grid of all favorited characters.
> 5. Include an empty state message in `FavoritesPage` when no favorites have been added yet.
> 6. Ensure strict TypeScript typing with NO `any` types.

**17:46 · copilot**

> Please polish `src/pages/CharacterDetailPage.tsx` to beautifully present ALL API details without hiding any character data:
> 
> 1. **Keep All API Details Visible:** Display all character properties including Films, Starships, Vehicles, Homeworld, Height, Mass, Gender, Birth Year, Hair Color, Eye Color, and Skin Color.
> 2. **Format Raw API URLs as Clean Badges/Tags:**
> 
> - For arrays like `films`, `vehicles`, and `starships`, convert raw SWAPI URLs (e.g. `[https://swapi.info/api/films/1](https://swapi.info/api/films/1)`) into neat, styled badges/chips with readable labels like `Film #1`, `Film #2`, `Vehicle #14`, `Starship #12` (or extract the ID to show readable names).
> - For `homeworld`, format the URL into a clean label like `Planet #1` instead of showing the raw full URL string.
> 3. **Format Units and Dates:**
> 
> - Add `cm` to `height` (e.g. `172 cm`) and `kg` to `mass` (e.g. `77 kg`).
> - Format `created` and `edited`/`last updated` ISO strings into human-readable dates (e.g. using `toLocaleDateString()`).
> 4. **Keep Action Elements:** Maintain the 'Add to Favorites' button and 'Back to List' link.
> 5. Ensure responsive CSS and clean TypeScript with NO `any` types.

**17:48 · copilot**

> Please update `src/pages/CharacterDetailPage.tsx` (and `swapi.ts` if needed) to resolve and display the ACTUAL names and titles instead of placeholder labels like `Film #1` or `Planet #1`:
> 
> 1. **Fetch Related Resource Names:**
> 
> - For `films`: Fetch each film URL using `Promise.all` and display the film's actual `title` (e.g., 'A New Hope', 'The Empire Strikes Back').
> - For `homeworld`: Fetch the planet URL and display the planet's actual `name` (e.g., 'Tatooine').
> - For `vehicles` and `starships`: Fetch each URL and display the actual vehicle/starship `name` (e.g., 'Snowspeeder', 'X-wing').
> - For `species`: Fetch and display the species `name` if available.
> 2. **Loading / Fallback State for Extra Data:**
> 
> - Show a subtle loading state/spinner for these badges while fetching their names, or fall back gracefully if a sub-fetch fails.
> 3. **UI Display:**
> 
> - Display the resolved names in clean, styled badges/chips.
> - Remove the redundant `API URL` card from the bottom of the page.
> 4. Ensure strict TypeScript typing with NO `any` types.

**17:53 · copilot**

> Please update `src/pages/CharacterDetailPage.tsx` to make all badge elements plain, non-clickable text tags:
> 
> 1. **Remove Hyperlinks:** Ensure badges for `films`, `homeworld`, `vehicles`, `starships`, and `species` are rendered as simple `<span>` or `<div>` elements, NOT `<a>` anchor tags or React Router `<Link>` components.
> 2. **Disable Navigation:** Clicking on any badge (e.g. 'A New Hope', 'Tatooine', 'Snowspeeder') must NOT open external SWAPI URLs or navigate anywhere.
> 3. **Keep Styling:** Maintain the current purple badge visual style, rounded borders, and layout, but set the CSS `cursor` property to `default` (instead of `pointer`).
> 4. Ensure strict TypeScript typing with NO `any` types.

**17:55 · copilot**

> Please complete Task 6 from tasks.md: 'Develop Statistics page'.
> 
> Here are the specific instructions:
> 
> 1. In `src/pages/StatsPage.tsx`, construct an interactive and informative dashboard using data fetched from SWAPI and the user's favorites from `FavoritesContext`.
> 2. Calculate and render the following metrics:
> 
> - **Total Characters Count** vs **Total Favorites Count** (and percentage favorited).
> - **Average Height** of all characters (filtering out 'unknown' or non-numeric strings).
> - **Average Mass** of all characters (filtering out 'unknown' or non-numeric strings).
> - **Gender Breakdown** (counts and percentages for male, female, n/a, and unknown).
> 3. Display these stats using clean, styled card containers / summary tiles.
> 4. Ensure proper handling for loading states, empty favorites, and edge cases (e.g. division by zero or invalid numbers).
> 5. Ensure strict TypeScript typing with NO `any` types.

**18:00 · copilot**

> lease fix the layout overlap issue in `src/pages/StatsPage.tsx`:
> 
> 1. **Fix Header Overlap:** Ensure the `<h1>Statistics</h1>` heading is positioned cleanly above the top row of statistic cards with proper spacing (`margin-bottom` / `gap`), so it is not covered or overlapped by the card containers.
> 2. **Layout Polish:** Ensure consistent container margins and flex/grid alignment across the page.
> 3. Keep all current statistics calculations and TypeScript types intact.

**18:05 · copilot**

> Please complete Task 7 from tasks.md: 'Write unit tests with Vitest'.
> 
> Here are the specific instructions:
> 
> 1. Create a unit test file `src/utils/stats.test.ts` (or `src/utils/filter.test.ts`) to test app logic functions.
> 2. Implement at least 5 meaningful unit tests using `vitest` (`describe`, `it`, `expect`) covering:
> 
> - Filtering characters by search term (case-insensitive, empty query handling).
> - Sorting character lists (A-Z).
> - Calculating average height and mass (handling numeric vs 'unknown' values).
> - Gender breakdown counts calculation.
> 3. Ensure all tests pass when running `npm run test` (or `npx vitest run`).
> 4. Ensure clean TypeScript typing with NO `any` types.
