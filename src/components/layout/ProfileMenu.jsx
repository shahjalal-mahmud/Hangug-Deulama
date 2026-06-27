/* src/components/ProfileMenu.jsx */
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'My Profile', to: '/activity', icon: 'person' },
  { label: 'My List', to: '/activity', icon: 'bookmark' },
  { label: 'Settings', to: '/', icon: 'settings' },
];

const ProfileMenu = () => {
  return (
    <details className="dropdown dropdown-end">
      <summary
        className="w-9 h-9 rounded-full overflow-hidden border border-border-strong
                   cursor-pointer list-none focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-accent/60"
        aria-label="Open profile menu"
      >
        <div
          className="w-full h-full bg-surface-elevated flex items-center justify-center
                     text-text-secondary"
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
        </div>
      </summary>

      <ul
        className="dropdown-content menu mt-3 w-48 rounded-lg p-1.5 z-50
                   bg-surface-elevated border border-border shadow-xl"
      >
        {menuItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              className="text-sm text-text-secondary hover:text-text-primary
                         hover:bg-surface-overlay rounded-md transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default ProfileMenu;