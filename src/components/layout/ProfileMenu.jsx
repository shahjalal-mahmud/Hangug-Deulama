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

  /* Logged-out state: same rose→berry gradient as every other CTA on
     the site, so "Sign in" reads as an action, not a low-contrast pill
     (the old bg-accent + white-text combo was near-illegible — light
     pink background under white text). */
  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-2 rounded-full
                   text-xs font-semibold uppercase tracking-wide px-4 py-2.5
                   bg-linear-to-br from-[#FF7C9C] via-[#E23F63] to-[#C22C55]
                   text-[#FFF5F7] shadow-lg shadow-primary-container/30
                   hover:shadow-xl hover:shadow-primary-container/40 hover:brightness-105
                   active:scale-[0.98]
                   transition-all duration-300
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-primary/60 focus-visible:ring-offset-2
                   focus-visible:ring-offset-bg-base"
      >
        <span className="material-symbols-outlined text-[16px]">login</span>
        Sign in
      </Link>
    );
  }

  return (
    <details className="dropdown dropdown-end">
      <summary
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-border-strong
                   cursor-pointer list-none transition-colors duration-300
                   hover:border-primary/60
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                   focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        aria-label="Open profile menu"
      >
        {url ? (
          <img src={url} alt={user?.full_name || 'Profile'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center text-text-secondary">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
        )}
      </summary>

      <ul
        className="dropdown-content menu mt-3 w-56 rounded-xl p-1.5 z-50
                   bg-surface-container-high border border-border shadow-2xl shadow-black/40"
      >
        <li className="px-3 py-2.5 border-b border-border mb-1">
          <p className="text-text-primary text-sm font-semibold truncate">{user?.full_name}</p>
          <p className="text-text-tertiary text-[11px] truncate">{user?.email}</p>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm
                       text-text-secondary hover:text-text-primary hover:bg-surface-container
                       transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            My Profile
          </Link>
        </li>
        <li>
          <Link
            to="/activity"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm
                       text-text-secondary hover:text-text-primary hover:bg-surface-container
                       transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            My List
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm
                       text-text-secondary hover:text-danger hover:bg-surface-container
                       transition-colors duration-200"
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