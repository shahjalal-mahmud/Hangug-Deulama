/* src/App.jsx */
import { RouterProvider } from 'react-router-dom';
import { DramaProvider } from './context/DramaContext';
import { AuthProvider } from './context/AuthContext';
import router from './routes';

function App() {
  return (
    /* AuthProvider sits inside RouterProvider-equivalent context so any
       redirect from a ProtectedRoute can rely on a fully bootstrapped
       auth state. DramaProvider stays outside AuthProvider since the
       catalog data is publicly fetchable. */
    <AuthProvider>
      <DramaProvider>
        <RouterProvider router={router} />
      </DramaProvider>
    </AuthProvider>
  );
}

export default App;