/* src/layouts/MainLayout.jsx
   Top-level chrome for every page rendered inside the main layout
   (everything except /login and /register). Wraps the route's
   <Outlet /> with the navbar, footer, mobile bottom nav, and the
   floating Android download button.

   @see docs/PROJECT.md#sec-proj-ui-plan */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import Footer from '../components/layout/Footer';
import FloatingDownloadButton from '../components/layout/FloatingDownloadButton';

// NOTE: <Outlet /> is where React Router renders the matched child route
// (Home, Discover, Profile, etc.). Without it, the routes inside this
// layout would never appear on screen — the page would just show the
// chrome and nothing in the middle.
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