import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('proprules_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (error) {
        console.error('Error fetching user on mount', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed.');
    }

    localStorage.setItem('proprules_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (email, password) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed.');
    }

    localStorage.setItem('proprules_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('proprules_token');
    setToken(null);
    setUser(null);
  };

  const toggleWatchlist = async (firmId) => {
    if (!user) {
      throw new Error('You must be logged in to modify your watchlist.');
    }

    try {
      const response = await fetch(`/api/firms/${firmId}/watchlist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to modify watchlist.');
      }

      const data = await response.json();
      setUser(prev => ({
        ...prev,
        watchlist: data.watchlist
      }));
      return data.isSaved;
    } catch (error) {
      console.error('Error toggling watchlist', error);
      throw error;
    }
  };

  const saveQuiz = async (profile, matches) => {
    if (!user) return false;

    try {
      const response = await fetch('/api/quiz/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile, matches })
      });

      if (response.ok) {
        setUser(prev => ({
          ...prev,
          lastQuizProfile: profile,
          lastQuizMatches: matches
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving quiz results', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, toggleWatchlist, saveQuiz }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
