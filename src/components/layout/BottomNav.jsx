/* src/components/layout/BottomNav.jsx
   Mobile-only tab bar pinned to the bottom of the screen. Mirrors the
   desktop navbar so users on phones get the same primary destinations
   without scrolling. Hidden on md+ screens where the top navbar takes
   over.

   @see docs/PROJECT.md#sec-proj-ui-plan
   @see docs/components/layout/Navbar.jsx */

import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Discover', to: '/discover', icon: 'explore' },
  { label: 'For You', to: '/recommendations', icon: 'auto_awesome' },
  { label: 'Activity', to: '/activity', icon: 'person', requireAuth: true },
];

const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // NOTE: same pattern as Navbar — auth-required tabs intercept clicks
  // for anonymous users and send them to /login with a `from` state so
  // Login.jsx can bounce them back after a successful sign-in.
  const handleTabClick = (e, tab) => {
    if (tab.requireAuth && !isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: tab.to } } });
    }
  };

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed bottom-0 inset-x-0 z-50 md:hidden
                 bg-background/85 backdrop-blur-xl border-t border-border
                 flex justify-around items-center px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          onClick={(e) => handleTabClick(e, tab)}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors duration-300',
              isActive ? 'text-accent' : 'text-text-tertiary hover:text-text-secondary'
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] font-medium">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;