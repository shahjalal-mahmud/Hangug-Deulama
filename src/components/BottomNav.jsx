/* src/components/BottomNav.jsx */
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const tabs = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Discover', to: '/discover', icon: 'explore' },
  { label: 'For You', to: '/recommendations', icon: 'auto_awesome' },
  { label: 'Activity', to: '/activity', icon: 'person' },
];

const BottomNav = () => {
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