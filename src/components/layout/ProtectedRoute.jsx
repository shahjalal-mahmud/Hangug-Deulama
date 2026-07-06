/* src/components/layout/ProtectedRoute.jsx
   Gate for authenticated-only routes. While AuthContext is still
   bootstrapping we render a loading state so we don't briefly flash
   a redirect that would be confusing for users with a valid token. */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from '../ui/LoadingState';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) {
    return <LoadingState label="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;