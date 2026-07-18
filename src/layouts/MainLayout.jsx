import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Footer from '../components/layout/Footer';
import FloatingDownloadButton from '../components/layout/FloatingDownloadButton';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-28 pb-28 md:pb-16">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <FloatingDownloadButton />
    </div>
  );
};

export default MainLayout;