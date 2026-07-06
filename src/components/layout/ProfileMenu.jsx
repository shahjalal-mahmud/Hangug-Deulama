/* src/components/layout/ProfileMenu.jsx */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api';

const avatarUrl = (user) => {
  if (!user?.profile_image) return null;
  if (/^https?:\/\//i.test(user.profile_image)) return user.profile_image;
  return `${API_BASE_URL}/${user.profile_image}`;
};

const ProfileMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const url = avatarUrl(user);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* Logged-out state: a single sign-in link keeps the chrome uncluttered
     while still surfacing the entry point. */
  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-2 rounded-full bg-accent text-white
                   text-xs font-medium uppercase tracking-wide px-4 py-2
                   hover:bg-accent-hover transition-colors duration-300
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <span className="material-symbols-outlined text-[16px]">login</span>
        Sign in
      </Link>
    );
  }

  return (
    <details className="dropdown dropdown-end">
      <summary
        className="w-9 h-9 rounded-full overflow-hidden border border-border-strong
                   cursor-pointer list-none focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-accent/60"
        aria-label="Open profile menu"
      >
        {url ? (
          <img src={url} alt={user?.full_name || 'Profile'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-elevated flex items-center justify-center text-text-secondary">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
        )}
      </summary>

      <ul
        className="dropdown-content menu mt-3 w-52 rounded-lg p-1.5 z-50
                   bg-surface-elevated border border-border shadow-xl"
      >
        <li className="px-3 py-2 border-b border-border mb-1">
          <p className="text-text-primary text-sm font-medium truncate">{user?.full_name}</p>
          <p className="text-text-tertiary text-[11px] truncate">{user?.email}</p>
        </li>
        <li>
          <Link
            to="/profile"
            className="text-sm text-text-secondary hover:text-text-primary
                       hover:bg-surface-overlay rounded-md transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            My Profile
          </Link>
        </li>
        <li>
          <Link
            to="/activity"
            className="text-sm text-text-secondary hover:text-text-primary
                       hover:bg-surface-overlay rounded-md transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            My List
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left text-sm text-text-secondary hover:text-text-primary
                       hover:bg-surface-overlay rounded-md transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign out
          </button>
        </li>
      </ul>
    </details>
  );
};

export default ProfileMenu;