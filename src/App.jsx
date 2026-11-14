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
    location.pathname === '/mohamed-salma';

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
        <Route path="/invite/mohamed-salma" element={<MohamedSalmaPage />} />
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
