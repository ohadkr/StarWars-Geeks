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
