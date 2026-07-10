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
      className="fixed top-0 inset-x-0 z-50 bg-bg-base/70 backdrop-blur-xl
                 border-b border-border"
    >
      <div
        className="flex items-center justify-between gap-6
                   px-5 md:px-16 py-4"
      >
        <NavLink
          to="/"
          className="font-display text-xl md:text-2xl font-bold tracking-tight
                     text-primary uppercase shrink-0"
        >
          Hangug Deulama
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
                  'text-sm font-medium uppercase tracking-wide pb-1 border-b-2 transition-colors duration-300',
                  isActive
                    ? 'text-text-primary border-primary'
                    : 'text-text-secondary border-transparent hover:text-text-primary'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <SearchBar />
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