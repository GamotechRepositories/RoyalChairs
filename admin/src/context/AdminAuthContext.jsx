import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('royal_admin_token'));
  });

  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check admin session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('royal_admin_token');
      if (!token) {
        setIsAuthenticated(false);
        setAdminUser(null);
        return;
      }
      try {
        const res = await api.get('/admin/me');
        if (res.data?.success && res.data?.user) {
          setAdminUser(res.data.user);
          localStorage.setItem('royal_admin_user', JSON.stringify(res.data.user));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn('Admin token validation failed, resetting session:', err.message);
        localStorage.removeItem('royal_admin_token');
        localStorage.removeItem('royal_admin_user');
        setIsAuthenticated(false);
        setAdminUser(null);
      }
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      // Authenticate via dedicated Admin API with bcrypt verification
      const res = await api.post('/admin/login', { email, password });
      if (res.data?.success && res.data?.token) {
        localStorage.setItem('royal_admin_token', res.data.token);
        localStorage.setItem('royal_admin_user', JSON.stringify(res.data.user));
        setAdminUser(res.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, user: res.data.user };
      } else {
        throw new Error(res.data?.message || 'Authentication failed');
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Invalid administrator email or password';
      setAuthError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('royal_admin_token');
    localStorage.removeItem('royal_admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
    setAuthError(null);
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
