/* src/routes/index.jsx */
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Discover from '../pages/Discover';
import Recommendations from '../pages/Recommendations';
import Activity from '../pages/Activity';
import DramaDetails from '../pages/DramaDetails';

const router = createBrowserRouter([
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
        element: <Activity />,
      },
      {
        path: 'drama/:id',
        element: <DramaDetails />,
      },
    ],
  },
]);

export default router;