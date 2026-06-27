import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Shield, Sun, Moon, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { trackEvent } from '../utils/analytics';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (label, url) => {
    trackEvent('nav_click', label, url);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    trackEvent('cta_click', 'Logout', '/logout');
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '64px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'rgba(var(--bg), 0.9)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          transition: 'background 0.3s, border-color 0.3s'
        }}
      >
        <div
          className="container"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          <Link
            to="/"
            onClick={() => handleNavClick('Logo', '/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'Cabinet Grotesk, sans-serif',
              fontWeight: 900,
              fontSize: '1.4rem',
              color: 'var(--text-primary)'
            }}
          >
            <Shield size={22} style={{ color: 'var(--accent-hi)' }} /> PropRules
          </Link>

          <nav
            style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'center'
            }}
            className="nav-links"
          >
            <NavLink
              to="/"
              onClick={() => handleNavClick('Home', '/')}
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.9rem',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/firms"
              onClick={() => handleNavClick('Firms', '/firms')}
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.9rem',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
              })}
            >
              Firms
            </NavLink>
            <NavLink
              to="/compare"
              onClick={() => handleNavClick('Compare', '/compare')}
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.9rem',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
              })}
            >
              Compare
            </NavLink>
            <NavLink
              to="/find-my-firm"
              onClick={() => handleNavClick('Find My Firm', '/find-my-firm')}
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.9rem',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
              })}
            >
              Find My Firm
            </NavLink>
            <NavLink
              to="/blog"
              onClick={() => handleNavClick('Blog', '/blog')}
              style={({ isActive }) => ({
                fontWeight: 500,
                fontSize: '0.9rem',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
              })}
            >
              Blog
            </NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={toggleTheme}
              className="theme-btn"
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="btn btn-outline"
                  style={{
                    padding: '0.5rem 1rem',
                    borderColor: 'var(--border)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <User size={16} /> {user.email.split('@')[0]}
                </button>
                {dropdownOpen && (
                  <>
                    <div
                      onClick={() => setDropdownOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 140 }}
                    />
                    <div
                      className="user-dropdown"
                      style={{
                        display: 'block',
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-md)',
                        padding: '0.5rem 0',
                        minWidth: '160px',
                        zIndex: 150,
                        marginTop: '0.5rem'
                      }}
                    >
                      <Link
                        to="/account"
                        onClick={() => { setDropdownOpen(false); handleNavClick('Account', '/account'); }}
                        style={{ display: 'block', padding: '0.5rem 1rem', color: 'var(--text-primary)' }}
                      >
                        My Account
                      </Link>
                      {user.role === 'admin' && (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => { setDropdownOpen(false); handleNavClick('Admin', '/admin'); }}
                            style={{ display: 'block', padding: '0.5rem 1rem', color: 'var(--text-primary)' }}
                          >
                            Admin panel
                          </Link>
                          <Link
                            to="/admin-analytics"
                            onClick={() => { setDropdownOpen(false); handleNavClick('Admin Analytics', '/admin-analytics'); }}
                            style={{ display: 'block', padding: '0.5rem 1rem', color: 'var(--text-primary)' }}
                          >
                            Analytics
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 1rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '0.9rem',
                          borderTop: '1px solid var(--border)',
                          marginTop: '0.25rem'
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="nav-actions">
                <Link
                  to="/login"
                  onClick={() => handleNavClick('Login Redirect', '/login')}
                  style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => handleNavClick('Signup Redirect', '/signup')}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-btn"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--bg)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-110%)',
          opacity: mobileMenuOpen ? 1 : 0,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none'
        }}
      >
        <Link to="/" onClick={() => handleNavClick('Home Mobile', '/')}>Home</Link>
        <Link to="/firms" onClick={() => handleNavClick('Firms Mobile', '/firms')}>Firms</Link>
        <Link to="/compare" onClick={() => handleNavClick('Compare Mobile', '/compare')}>Compare</Link>
        <Link to="/find-my-firm" onClick={() => handleNavClick('Find My Firm Mobile', '/find-my-firm')}>Find My Firm</Link>
        <Link to="/blog" onClick={() => handleNavClick('Blog Mobile', '/blog')}>Blog</Link>
        {user ? (
          <>
            <Link to="/account" onClick={() => handleNavClick('Account Mobile', '/account')}>My Account</Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin" onClick={() => handleNavClick('Admin Mobile', '/admin')}>Admin panel</Link>
                <Link to="/admin-analytics" onClick={() => handleNavClick('Admin Analytics Mobile', '/admin-analytics')}>Analytics</Link>
              </>
            )}
            <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: 'var(--danger)' }}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => handleNavClick('Login Mobile', '/login')}>Log in</Link>
            <Link to="/signup" onClick={() => handleNavClick('Signup Mobile', '/signup')}>Sign up</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
