/* src/components/layout/ProfileMenu.jsx */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resolveAvatar } from '../../utils/avatar';
import Avatar from '../ui/Avatar';

const ProfileMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const avatarSrc = resolveAvatar(user?.profile_image);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* Logged-out state: matches the navbar logo gradient exactly.
     Uses the same primary→primary-container→secondary gradient with
     matching hover effects (scale + rotate) and shadow treatment. */
  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-2 rounded-xl
                   bg-linear-to-br from-primary via-primary-container to-secondary
                   text-on-primary
                   shadow-lg shadow-primary-container/25
                   transition-all duration-300 ease-cinematic
                   hover:scale-105 hover:rotate-3
                   hover:shadow-xl hover:shadow-primary-container/40
                   active:scale-[0.98]
                   font-display text-sm font-bold
                   px-5 py-2.5
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-primary/60 focus-visible:ring-offset-2
                   focus-visible:ring-offset-bg-base"
      >
        <span className="material-symbols-outlined text-[18px]">login</span>
        Sign In
      </Link>
    );
  }

  return (
    <details className="dropdown dropdown-end">
      <summary
        className="group w-10 h-10 rounded-full p-0.5 cursor-pointer list-none
                   bg-linear-to-br from-primary via-primary-container to-secondary
                   transition-transform duration-300 ease-cinematic
                   hover:scale-105
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                   focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        aria-label="Open profile menu"
      >
        <span className="block w-full h-full rounded-full overflow-hidden bg-surface">
          <Avatar src={avatarSrc} alt={user?.full_name} className="w-full h-full rounded-full" />
        </span>
      </summary>

      <ul
        className="dropdown-content menu mt-3 w-64 rounded-2xl p-0 z-50 overflow-hidden
                   bg-surface-container-high border border-border shadow-2xl shadow-black/40
                   animate-fade-up"
      >
        {/* Identity header — a miniature echo of the profile hero, so the
            menu reads as "you," not a generic settings list. */}
        <li className="border-b border-border">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-4 rounded-none hover:bg-surface-container
                       transition-colors duration-200"
          >
            <span
              className="w-11 h-11 rounded-full p-0.5 flex-none
                         bg-linear-to-br from-primary via-primary-container to-secondary"
            >
              <span className="block w-full h-full rounded-full overflow-hidden bg-surface">
                <Avatar src={avatarSrc} alt={user?.full_name} className="w-full h-full rounded-full" />
              </span>
            </span>
            <span className="min-w-0">
              <p className="text-text-primary text-sm font-semibold truncate">{user?.full_name}</p>
              <p className="text-text-tertiary text-[11px] truncate">{user?.email}</p>
            </span>
          </Link>
        </li>

        <li className="p-1.5">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm
                       text-text-secondary hover:text-text-primary hover:bg-surface-container
                       transition-colors duration-200"
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-none bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[16px]">person</span>
            </span>
            My Profile
          </Link>
        </li>
        <li className="px-1.5 pb-1.5">
          <Link
            to="/activity"
            className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm
                       text-text-secondary hover:text-text-primary hover:bg-surface-container
                       transition-colors duration-200"
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-none bg-secondary/10 text-secondary">
              <span className="material-symbols-outlined text-[16px]">bookmark</span>
            </span>
            My List
          </Link>
        </li>

        <li className="p-1.5 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2.5 py-2.5 mt-1 rounded-lg text-left text-sm
                       text-text-secondary hover:text-danger hover:bg-danger/10
                       transition-colors duration-200"
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center flex-none bg-danger/10 text-danger">
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </span>
            Sign out
          </button>
        </li>
      </ul>
    </details>
  );
};

export default ProfileMenu;