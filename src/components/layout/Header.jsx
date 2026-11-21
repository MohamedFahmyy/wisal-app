import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpLeft, WhatsAppIcon } from '../../utils/icons';
import { BrandLogo } from '../common/BrandLogo';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          <BrandLogo />

          <nav className="desktop-nav" aria-label="Main Navigation">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              الرئيسية
            </NavLink>
            <NavLink to="/demos" className={({ isActive }) => (isActive ? 'active' : '')}>
              التصميمات
            </NavLink>
            <NavLink to="/card" className={({ isActive }) => (isActive ? 'active' : '')}>
              كروت QR
            </NavLink>
            <NavLink to="/guests" className={({ isActive }) => (isActive ? 'active' : '')}>
              قائمة الضيوف
            </NavLink>
            <NavLink to="/links" className={({ isActive }) => (isActive ? 'active' : '')}>
              صانع الروابط
            </NavLink>
            <NavLink to="/features" className={({ isActive }) => (isActive ? 'active' : '')}>
              المميزات
            </NavLink>
            <NavLink to="/packages" className={({ isActive }) => (isActive ? 'active' : '')}>
              الباقات
            </NavLink>
            <NavLink to="/faq" className={({ isActive }) => (isActive ? 'active' : '')}>
              الأسئلة الشائعة
            </NavLink>
          </nav>

          <div className="header-actions">
            <a
              href="https://wa.me/201112194828?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D9%90%D8%B5%D8%A7%D9%84%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AF%D8%B9%D9%88%D8%A9%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9"
              target="_blank"
              rel="noreferrer"
              className="btn-order-cta"
            >
              <WhatsAppIcon size={16} />
              <span>اطلب دعوتك</span>
              <ArrowUpLeft size={16} className="btn-arrow" />
            </a>

            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'is-open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Drawer (placed outside header to prevent backdrop-filter stacking trap) */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-inner">
          <nav className="mobile-nav-links" aria-label="Mobile Navigation">
            <NavLink to="/" end onClick={closeMenu}>
              الرئيسية
            </NavLink>
            <NavLink to="/demos" onClick={closeMenu}>
              معرض التصميمات
            </NavLink>
            <NavLink to="/card" onClick={closeMenu}>
              كروت QR للطباعة
            </NavLink>
            <NavLink to="/guests" onClick={closeMenu}>
              لوحة إدارة الضيوف
            </NavLink>
            <NavLink to="/links" onClick={closeMenu}>
              صانع روابط المعازيم
            </NavLink>
            <NavLink to="/features" onClick={closeMenu}>
              المميزات والتفاصيل
            </NavLink>
            <NavLink to="/packages" onClick={closeMenu}>
              الباقات والأسعار
            </NavLink>
            <NavLink to="/faq" onClick={closeMenu}>
              الأسئلة الشائعة
            </NavLink>
          </nav>

          <div className="mobile-drawer-footer">
            <a
              href="https://wa.me/201112194828?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%88%D9%90%D8%B5%D8%A7%D9%84%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D8%AF%D8%B9%D9%88%D8%A9%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%D8%A9"
              target="_blank"
              rel="noreferrer"
              className="btn-order-cta mobile-cta"
              onClick={closeMenu}
            >
              <WhatsAppIcon size={18} />
              <span>تواصل معنا عبر واتساب</span>
              <ArrowUpLeft size={16} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
