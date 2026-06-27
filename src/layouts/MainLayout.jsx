/* src/layouts/MainLayout.jsx */
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 md:pt-28 pb-28 md:pb-16">
        <Outlet />
      </main>

      <BottomNav />
      {/* Footer arrives in its own step — intentionally omitted here */}
    </div>
  );
};

export default MainLayout;