import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const Footer = () => {
  const handleLinkClick = (label, url) => {
    trackEvent('nav_click', `Footer: ${label}`, url);
  };

  return (
    <footer
      style={{
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid var(--border)',
        padding: '4rem 0 2rem',
        color: '#f5f5f0',
        transition: 'background-color 0.3s, border-color 0.3s'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fff',
                fontFamily: 'Cabinet Grotesk, sans-serif',
                fontWeight: 900,
                fontSize: '1.3rem'
              }}
            >
              <Shield size={20} style={{ color: 'var(--accent-hi)' }} /> PropRules
            </div>
            <p style={{ color: '#6b6b6b', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Democratizing prop firm rules. Compare challenges side-by-side, spot hidden clauses, and trade with confidence.
            </p>
          </div>

          <div>
            <h4
              style={{
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Platform
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/firms" onClick={() => handleLinkClick('Firms', '/firms')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  Prop Firms Directory
                </Link>
              </li>
              <li>
                <Link to="/compare" onClick={() => handleLinkClick('Compare', '/compare')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  Compare Side-by-Side
                </Link>
              </li>
              <li>
                <Link to="/find-my-firm" onClick={() => handleLinkClick('Find My Firm', '/find-my-firm')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  Find My Firm Quiz
                </Link>
              </li>
              <li>
                <Link to="/blog" onClick={() => handleLinkClick('Blog', '/blog')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  Read Blog Articles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              Legal & Disclosures
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a href="#about" onClick={() => handleLinkClick('About Us', '#about')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" onClick={() => handleLinkClick('Contact Us', '#contact')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={() => handleLinkClick('Privacy Policy', '#privacy')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={() => handleLinkClick('Terms', '#terms')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#affiliate" onClick={() => handleLinkClick('Affiliate Disclosure', '#affiliate')} style={{ color: '#6b6b6b', fontSize: '0.875rem' }} className="footer-link">
                  Affiliate Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #222',
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#4b4b4b',
            fontSize: '0.8rem',
            lineHeight: 1.8
          }}
        >
          <p style={{ marginBottom: '1rem', maxWidth: '800px', margin: '0 auto 1rem' }}>
            Disclaimer: PropRules is an independent research and comparison website. We are not a proprietary trading firm, do not hold customer funds, and do not offer financial or investment advice. Trading in financial markets carries substantial risk. Always read the official prop firm objective agreements carefully before registering.
          </p>
          <p>&copy; {new Date().getFullYear()} PropRules. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
