import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('royal_admin_user');
    return saved ? JSON.parse(saved) : {
      name: 'Lord Director Sterling',
      email: 'admin@royalchairs.co.uk',
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('royal_admin_token') ? true : true; // Default authorized for demonstration
  });

  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      // Attempt backend login
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.token) {
        localStorage.setItem('royal_admin_token', res.data.token);
        localStorage.setItem('royal_admin_user', JSON.stringify(res.data.user));
        setAdminUser(res.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend login fallback to local admin session:', err.message);
      // Fallback for admin credentials
      if (email === 'admin@royalchairs.co.uk' && password === 'admin123') {
        const mockAdmin = {
          name: 'Lord Director Sterling',
          email: 'admin@royalchairs.co.uk',
          role: 'Super Administrator',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        };
        localStorage.setItem('royal_admin_token', 'mock_admin_jwt_token_2026');
        localStorage.setItem('royal_admin_user', JSON.stringify(mockAdmin));
        setAdminUser(mockAdmin);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true };
      }
      setAuthError(err.response?.data?.message || 'Invalid admin credentials');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('royal_admin_token');
    localStorage.removeItem('royal_admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        authError,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
