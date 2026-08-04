/* src/components/layout/ProtectedRoute.jsx
   Gate for authenticated-only routes. While AuthContext is still
   bootstrapping we render a loading state so we don't briefly flash
   a redirect that would be confusing for users with a valid token.

   @see docs/ARCHITECTURE.md#sec-auth-context */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from '../ui/LoadingState';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, bootstrapped } = useAuth();
  const location = useLocation();

  // NOTE: the three branches below are deliberately ordered — we check
  // bootstrapped first, then isAuthenticated, then render. A user with
  // a saved token who reloads the page would briefly look "logged out"
  // until AuthContext finished verifying the token, which would cause
  // an unwanted redirect to /login. Showing a loading state instead
  // keeps the experience smooth.
  if (!bootstrapped) {
    return <LoadingState label="Checking your session" />;
  }

  // NOTE: we pass `state={{ from: location }}` so the Login page knows
  // which page the user was trying to reach — Login reads it after a
  // successful login and bounces them back.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;