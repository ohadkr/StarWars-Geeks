# PRD — StarWars Geeks

## 1. Pitch
A web application displaying a catalog of characters from the "Star Wars" universe in a convenient Master-Detail view, designed for fans and geeks who want to explore character information.

## 2. Who it is for
Star Wars fans who want to quickly find physical data and basic information (such as height, mass, and birth year) about their favorite characters in a simple and fast interface.

## 3. Screens
- **List** — The character list: each row will display only the character's name.
- **Details** — The details panel: will display the character's name, height, mass, hair color, birth year, and gender upon selection.

## 4. Must-have features
1. Dynamic character list fetched in real-time from a public API.
2. Expanded detail view (Master-Detail) triggered when clicking on a character from the list.
3. A search bar allowing users to filter the character list by name.
4. Network state management: a "Loading..." state during requests, and an error message in case of network failure.

## 5. Acceptance criteria
- When I load the app, I see a "Loading" message, followed by a list of Star Wars characters.
- When I click on a character in the list, I see their detailed information (height, birth year, etc.) on the screen.
- When I type a name in the search bar, I see the character list instantly filter to match my input.
- When I open the app without an internet connection, I see a clear error message instead of a blank or broken screen.

## 6. Not now
- Pagination through different pages of the character list.
- Displaying the planet the character comes from (requires an additional API call per character).
- Displaying character images (the basic API does not include images).
- Saving favorite characters to Local Storage.

## 7. Data
- **API:** `https://swapi.info/api/people`
- **List fields:** `name`
- **Details fields:** `name`, `height`, `mass`, `hair_color`, `birth_year`, `gender`