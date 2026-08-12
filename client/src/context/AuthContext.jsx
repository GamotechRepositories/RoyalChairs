import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from './CartContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showNotification } = useCart();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('royalchairs_token') || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Set default authorization header on api instance whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('royalchairs_token', token);
      fetchCurrentUser();
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('royalchairs_token');
      setUser(null);
    }
  }, [token]);

  // Fetch logged in user profile from GET /api/auth/me
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Fetch Current User Error:', err);
      // Token might be invalid/expired
      logout();
    }
  };

  // Register Function
  const register = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data && response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        showNotification(response.data.message || 'Registration successful!');
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  // Login Function
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        showNotification(response.data.message || 'Login successful!');
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setAuthError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  // Google Login Function
  const googleLogin = async (credential) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.post('/auth/google', { credential });
      if (response.data && response.data.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        showNotification(response.data.message || 'Google sign-in successful!');
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google sign-in failed. Please try again.';
      setAuthError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  // Logout Function
  const logout = () => {
    setToken(null);
    setUser(null);
    showNotification('Signed out of account');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        register,
        login,
        googleLogin,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
