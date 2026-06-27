import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-28 pb-28 md:pb-16">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default MainLayout;