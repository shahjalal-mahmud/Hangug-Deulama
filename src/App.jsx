/* src/App.jsx */
import { RouterProvider } from 'react-router-dom';
import { DramaProvider } from './context/DramaContext';
import router from './routes';

function App() {
  return (
    <DramaProvider>
      <RouterProvider router={router} />
    </DramaProvider>
  );
}

export default App;