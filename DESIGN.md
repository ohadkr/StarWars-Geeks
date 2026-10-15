# StarWars Geeks - Design System & UI/UX Architecture

## 1. Visual Identity & Brand Concept
The design system of **StarWars Geeks** bridges modern, clean Web application interfaces with subtle galactic thematic accents. The palette relies on high-contrast cards, neon accent highlights, and adaptive surfaces that deliver complete readability across both Light and Dark modes.

---

## 2. Color Palette & Typography

### Light & Dark Themes
- **Light Mode:** Crisp neutral backgrounds (`bg-gray-50`/`bg-white`), dark slate typography (`text-gray-900`), soft purple accents (`purple-600`/`purple-100` highlights).
- **Dark Mode:** Deep space background (`bg-slate-950`/`bg-slate-900`), high-contrast white/light text (`text-slate-100`), glowing purple/cyan accents (`purple-400`/`cyan-400`).

### Typography & Text Handling Guidelines
- **Font Family:** Clean sans-serif font stack for maximum cross-platform legibility.
- **Title Hierarchy:** Unified page headings with a distinct gradient or accent underline.
- **Card Titles & Character Names:**
  - Names MUST NOT be truncated abruptly with single-line `truncate` or hidden `overflow` if it cuts off identity (e.g., *Bail Prestor Organa*, *Beru Whitesun Lars*).
  - Use responsive text scaling (`text-base sm:text-lg font-bold`), tight line heights (`leading-tight`), and multi-line wrapping (`line-clamp-2` / `break-words`) to guarantee full visibility across all screen sizes.

---

## 3. Component Architecture & Responsive Layout

### Layout & Grid System
- **Responsive Breakpoints:** 
  - Mobile (1 col) $\rightarrow$ Tablet (2-3 cols) $\rightarrow$ Desktop (4 cols) grid layouts for character cards.
- **Navigation (`Navbar`):** Top-sticky header housing primary routes (`Home`, `Films`, `Favorites`, `Statistics`, `Compare`), search focus indicator, and a persistent Theme Toggle (Sun/Moon).

### Core Components
- **`CharacterCard`:** Compact card displaying avatar image, full character name, gender, birth year, and interactive favorite star toggle.
- **`CharacterAvatar`:** Resilient image container handling dynamic image loading with error boundaries.
- **`FilmBadge` / `FilmPoster`:** Distinct badges featuring film posters or styled titles for instant saga recognition.
- **`CompareView`:** Side-by-side spec sheet comparing attributes (height, mass, homeworld, species) between two selected entities.
- **`StatsDashboard`:** Dual-section analytical layout comparing overall dataset metrics against user favorites.

---

## 4. Image Resilience & Network Strategy
To guarantee a zero-broken-UI interface regardless of external network conditions or campus firewall restrictions:
1. **Primary Source:** High-resolution assets via GitHub Raw CDN (`akabab/starwars-api`).
2. **Graceful Fallback:** Automatic fallback to unique **DiceBear Bottts SVG** robot avatars whenever an asset fails to load (e.g., 404, CORS block, or offline mode).
3. **Optimized Layouts:** Standardized aspect ratio (`aspect-square` or `object-cover`) to avoid layout shifts (CLS) during image hydration.

---

## 5. Micro-Interactions & Accessibility (a11y)
- **Keyboard Shortcuts:** Global `/` key event listener instantly focuses the primary character search bar.
- **Keyboard Navigation:** Full tab-stop support with high-contrast focus rings (`focus:ring-2 focus:ring-purple-500`).
- **Reduced Motion:** Respects `prefers-reduced-motion` for page transitions and card hover animations.
- **Status Indicators:** Clear badges for selection states, empty state messages, and loading placeholders.