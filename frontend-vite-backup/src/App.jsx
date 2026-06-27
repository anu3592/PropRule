import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Firms from './pages/Firms';
import Compare from './pages/Compare';
import FindMyFirm from './pages/FindMyFirm';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Admin from './pages/Admin';
import AdminAnalytics from './pages/AdminAnalytics';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { trackEvent } from './utils/analytics';

// Layout wrapper to inject scroll to top and route tracking
const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Track page views
    trackEvent('visit', `Viewed Page: ${location.pathname}`, location.pathname);
  }, [location]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/firms" element={<Firms />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/find-my-firm" element={<FindMyFirm />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
