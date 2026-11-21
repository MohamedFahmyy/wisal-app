import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DemosPage from './pages/DemosPage';
import FeaturesPage from './pages/FeaturesPage';
import PackagesPage from './pages/PackagesPage';
import FAQPage from './pages/FAQPage';
import InvitationPage from './pages/InvitationPage';
import MazenFaridaPage from './pages/MazenFaridaPage';
import MohamedSalmaPage from './pages/MohamedSalmaPage';
import VelvetPage from './pages/VelvetPage';
import RoseArchPage from './pages/RoseArchPage';
import LunePage from './pages/LunePage';
import GuestDashboardPage from './pages/GuestDashboardPage';
import LinkGeneratorPage from './pages/LinkGeneratorPage';
import QRCardPage from './pages/QRCardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LayoutWrapper() {
  const location = useLocation();
  const isInvitationRoute =
    location.pathname.startsWith('/invite/') ||
    location.pathname === '/mazen-farida' ||
    location.pathname === '/mohamed-salma' ||
    location.pathname === '/mohamed-salma-v2' ||
    location.pathname === '/velvet' ||
    location.pathname === '/rosearch' ||
    location.pathname === '/lune';

  return (
    <div className="app-layout-container">
      <ScrollToTop />
      {!isInvitationRoute && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/mazen-farida" element={<MazenFaridaPage />} />
        <Route path="/mohamed-salma" element={<MohamedSalmaPage />} />
        <Route path="/mohamed-salma-v2" element={<MohamedSalmaPage version={2} />} />
        <Route path="/invite/mohamed-salma" element={<MohamedSalmaPage />} />
        <Route path="/invite/mohamed-salma-v2" element={<MohamedSalmaPage version={2} />} />
        <Route path="/velvet" element={<VelvetPage />} />
        <Route path="/invite/velvet" element={<VelvetPage />} />
        <Route path="/rosearch" element={<RoseArchPage />} />
        <Route path="/invite/rosearch" element={<RoseArchPage />} />
        <Route path="/lune" element={<LunePage />} />
        <Route path="/invite/lune" element={<LunePage />} />
        <Route path="/invite/:slug" element={<InvitationPage />} />
        <Route path="/guests" element={<GuestDashboardPage />} />
        <Route path="/admin" element={<GuestDashboardPage />} />
        <Route path="/dashboard" element={<GuestDashboardPage />} />
        <Route path="/links" element={<LinkGeneratorPage />} />
        <Route path="/card" element={<QRCardPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      {!isInvitationRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}
