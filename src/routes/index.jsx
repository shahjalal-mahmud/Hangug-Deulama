/* src/routes/index.jsx */
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

const router = createBrowserRouter([
  /* Auth screens get their own layout-less branch — no navbar/footer
     would just clutter them. */
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'discover',
        element: <Discover />,
      },
      {
        path: 'recommendations',
        element: <Recommendations />,
      },
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
      {
        path: 'drama/:id',
        element: <DramaDetails />,
      },
    ],
  },
]);

export default router;