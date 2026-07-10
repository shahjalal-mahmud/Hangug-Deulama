/* src/components/layout/Navbar.jsx */
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import SearchBar from './SearchBar';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleNavClick = (e, link) => {
    if (link.requireAuth && !isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: link.to } } });
    }
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-transparent transition-all duration-300"
    >
      <div
        className="mx-auto max-w-container-max flex items-center justify-between gap-6
                   px-5 md:px-10 lg:px-16 py-3.5"
      >
        {/* Brand — small gradient hangul monogram + two-tone wordmark.
            The Hangul mark is the one place this header spends its
            personality; a Korean-drama product deserves more than a
            generic wordmark, but the rest of the bar stays quiet. */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="Hangug Deulama — Home"
        >
          <span
            className="flex items-center justify-center w-9 h-9 rounded-xl
                       bg-linear-to-br from-primary via-primary-container to-secondary
                       shadow-lg shadow-primary-container/25
                       transition-transform duration-300 ease-cinematic
                       group-hover:scale-105 group-hover:rotate-3"
          >
            <span className="font-display text-base font-bold text-on-primary">한</span>
          </span>

          <span className="flex flex-col leading-none">
            <span className="font-display text-lg md:text-xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent [text-shadow:0_0_30px_rgba(255,178,183,0.15)]">
                Hangug
              </span>{' '}
              <span className="text-text-primary">Deulama</span>
            </span>
            <span className="hidden sm:block eyebrow text-text-tertiary text-[10px] tracking-[0.2em] mt-0.5">
              한국 드라마 · Discover
            </span>
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {NAVBAR_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={(e) => handleNavClick(e, link)}
              className={({ isActive }) =>
                clsx(
                  'group relative py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-300',
                  isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={clsx(
                      'absolute left-0 -bottom-px h-0.5 rounded-full',
                      'bg-linear-to-r from-primary via-primary-container to-secondary',
                      'transition-all duration-300 ease-cinematic',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <SearchBar />
          <span className="hidden md:block w-px h-6 bg-border-strong" aria-hidden="true" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

const NAVBAR_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Discover', to: '/discover' },
  { label: 'For You', to: '/recommendations' },
  { label: 'My List', to: '/activity', requireAuth: true },
];

export default Navbar;