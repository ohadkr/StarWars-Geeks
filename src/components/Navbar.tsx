import { NavLink } from 'react-router-dom'
import './Navbar.css'

interface NavbarProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/films"
        className={({ isActive }) =>
          isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
        }
      >
        Films
      </NavLink>
      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
        }
      >
        Favorites
      </NavLink>
      <NavLink
        to="/stats"
        className={({ isActive }) =>
          isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
        }
      >
        Statistics
      </NavLink>
      <NavLink
        to="/compare"
        className={({ isActive }) =>
          isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
        }
      >
        Compare
      </NavLink>
      <button
        className="navbar__theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <svg
            className="navbar__theme-icon navbar__theme-icon--sun"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
        ) : (
          <svg
            className="navbar__theme-icon navbar__theme-icon--moon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" />
            <path d="m16.5 3 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" />
          </svg>
        )}
      </button>
    </nav>
  )
}

export default Navbar
