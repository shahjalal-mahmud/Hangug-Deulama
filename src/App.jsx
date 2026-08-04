/* src/App.jsx
   Top-level React component. Wraps the router in our two contexts —
   AuthContext for the JWT/session lifecycle and DramaContext for the
   catalog + per-user activity state.

   The order matters: AuthProvider is the outer wrapper because some
   drama mutations (like recording a swipe) only fire when logged in,
   and they need access to the auth state to decide that.

   @see docs/ARCHITECTURE.md#sec-auth-context
   @see docs/ARCHITECTURE.md#sec-drama-context */

import { RouterProvider } from 'react-router-dom';
import { DramaProvider } from './context/DramaContext';
import { AuthProvider } from './context/AuthContext';
import router from './routes';

function App() {
  return (
    // NOTE: AuthProvider is on the outside so ProtectedRoute children
    // (e.g. /activity, /profile) always have a fully bootstrapped auth
    // state available before they render — see ProtectedRoute.jsx.
    <AuthProvider>
      <DramaProvider>
        <RouterProvider router={router} />
      </DramaProvider>
    </AuthProvider>
  );
}

export default App;