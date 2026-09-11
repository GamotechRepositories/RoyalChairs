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
        let res;
        try {
          res = await api.get('/admin/me');
        } catch (err1) {
          if (err1.response?.status === 404) {
            try {
              res = await api.get('/auth/admin/me');
            } catch (err2) {
              res = await api.get('/auth/me');
            }
          } else {
            throw err1;
          }
        }

        if (res?.data?.success && (res.data.user || res.data.admin)) {
          const userData = res.data.user || res.data.admin;
          setAdminUser(userData);
          localStorage.setItem('royal_admin_user', JSON.stringify(userData));
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
      // Authenticate via dedicated Admin API with multi-endpoint fallback
      let res;
      try {
        res = await api.post('/admin/login', { email, password });
      } catch (err1) {
        if (err1.response?.status === 404) {
          try {
            res = await api.post('/auth/admin/login', { email, password });
          } catch (err2) {
            if (err2.response?.status === 404) {
              res = await api.post('/auth/login', { email, password });
            } else {
              throw err2;
            }
          }
        } else {
          throw err1;
        }
      }

      if (res.data?.success && res.data?.token) {
        const userData = res.data.user || {
          email,
          name: 'Super Admin',
          role: 'Super Administrator',
        };
        localStorage.setItem('royal_admin_token', res.data.token);
        localStorage.setItem('royal_admin_user', JSON.stringify(userData));
        setAdminUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, user: userData };
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
