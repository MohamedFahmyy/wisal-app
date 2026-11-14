import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, InstagramIcon, WhatsAppIcon, Sparkles } from '../../utils/icons';
import { BrandLogo } from '../common/BrandLogo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top-curve">
        <span className="footer-flourish">❦</span>
      </div>

      <div className="footer-main">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <BrandLogo />
            <p className="footer-mission">
              وِصال — منصة دعوات إلكترونية فاخرة تصنع أول لحظة في حكايتكم بتفاصيل استثنائية، تجربة تفاعلية ساحرة، وتصميم يعكس ذوقكم الرفيع.
            </p>
            <div className="footer-social-links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://wa.me/201112194828"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col links-col">
            <h4 className="footer-col-title">استكشف وِصال</h4>
            <ul>
              <li>
                <Link to="/demos">معرض التصميمات (13 قالب مميز)</Link>
              </li>
              <li>
                <Link to="/card">كروت QR المطبوعة للترابيزات</Link>
              </li>
              <li>
                <Link to="/guests">لوحة إدارة قائمة الضيوف</Link>
              </li>
              <li>
                <Link to="/links">صانع روابط المعازيم المخصصة</Link>
              </li>
              <li>
                <Link to="/features">المميزات والتجربة التفاعلية</Link>
              </li>
              <li>
                <Link to="/packages">الباقات والأسعار</Link>
              </li>
              <li>
                <Link to="/faq">الأسئلة الشائعة</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col categories-col">
            <h4 className="footer-col-title">المناسبات</h4>
            <ul>
              <li>
                <Link to="/demos?cat=wedding">دعوات زفاف ملكية</Link>
              </li>
              <li>
                <Link to="/demos?cat=engagement">حفلات الخطوبة</Link>
              </li>
              <li>
                <Link to="/demos?cat=katbketab">عقد قران وكتب كتاب</Link>
              </li>
              <li>
                <Link to="/demos?cat=birthday">أعياد ميلاد وذكرى سنوية</Link>
              </li>
              <li>
                <Link to="/demos?cat=graduation">احتفالات التخرج</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col note-col">
            <h4 className="footer-col-title">وعد وِصال</h4>
            <div className="promise-box">
              <span className="promise-sparkle">
                <Sparkles size={16} />
              </span>
              <p>
                «أجمل الدعوات مش اللي بتقول للناس ييجوا… لكن اللي بتخليهم يستنوا اليوم من قبل ما ييجي.»
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} وِصال (Wisal Digital Invitations). جميع الحقوق محفوظة.
          </p>
          <div className="footer-crafted">
            <span>صُنع بكل حب وشغف في مصر</span>
            <Heart size={14} className="heart-icon" fill="currentColor" />
          </div>
        </div>
      </div>
    </footer>
  );
}
