/* src/components/Navbar.jsx */
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import SearchBar from '../SearchBar';
import NotificationButton from './NotificationButton';
import ProfileMenu from './ProfileMenu';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Discover', to: '/discover' },
  { label: 'For You', to: '/recommendations' },
  { label: 'My List', to: '/activity' },
];

const Navbar = () => {
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl
                 border-b border-border"
    >
      <div
        className="flex items-center justify-between gap-6
                   px-5 md:px-16 py-4"
      >
        <NavLink
          to="/"
          className="font-display text-xl md:text-2xl font-bold tracking-tight
                     text-accent uppercase shrink-0"
        >
          Hangug Deulama
        </NavLink>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-medium uppercase tracking-wide pb-1 border-b-2 transition-colors duration-300',
                  isActive
                    ? 'text-text-primary border-accent'
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
          <NotificationButton />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;