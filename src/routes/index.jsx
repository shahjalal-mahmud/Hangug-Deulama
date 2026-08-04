/* src/routes/index.jsx
   The app's URL → component map, built once with createBrowserRouter.
   Auth-required pages sit behind ProtectedRoute; everything else
   (browse, drama details) stays public so casual visitors can poke
   around without signing up first.

   @see docs/PROJECT.md#sec-proj-ui-plan
   @see docs/ARCHITECTURE.md#sec-auth-context */

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Discover from '../pages/Discover';
import Recommendations from '../pages/Recommendations';
import Activity from '../pages/Activity';
import DramaDetails from '../pages/DramaDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// NOTE: `basename: '/deulama'` means the whole app is mounted under
// /deulama on the live server — every URL in the app becomes
// /deulama/discover, /deulama/profile, etc. This keeps the frontend
// in its own folder behind a reverse proxy (Apache), separate from
// the PHP backend at /api.
const router = createBrowserRouter(
  [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'discover', element: <Discover /> },
        { path: 'recommendations', element: <Recommendations /> },
        {
          path: 'activity',
          element: (
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        { path: 'drama/:id', element: <DramaDetails /> },
      ],
    },
  ],
  {
    basename: '/deulama',
  }
);

export default router;