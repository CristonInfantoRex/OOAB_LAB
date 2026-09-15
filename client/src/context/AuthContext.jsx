import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    sessionStorage.getItem('blood_bank_token') || localStorage.getItem('blood_bank_token') || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load User Profile on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        // Keep fallback token payload if endpoint fails temporarily
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const saveAuthData = (newToken, newUser) => {
    sessionStorage.setItem('blood_bank_token', newToken);
    sessionStorage.setItem('blood_bank_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        saveAuthData(res.data.token, res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const googleLogin = async (email = 'john@example.com', name = 'Google User', bloodGroup = 'O+') => {
    setError(null);
    try {
      const res = await API.post('/auth/google', { email, name, bloodGroup });
      if (res.data.success) {
        saveAuthData(res.data.token, res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google authentication failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      const res = await API.post('/auth/register', formData);
      if (res.data.success) {
        saveAuthData(res.data.token, res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const sendOtp = async (phone) => {
    try {
      const res = await API.post('/auth/send-otp', { phone });
      return res.data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (phone, otp) => {
    try {
      const res = await API.post('/auth/verify-otp', { phone, otp });
      if (res.data.success && res.data.token) {
        saveAuthData(res.data.token, res.data.user);
      }
      return res.data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'OTP verification failed' };
    }
  };

  // Demo helper: Quick login as Admin or User
  const quickDemoLogin = async (roleType) => {
    if (roleType === 'admin') {
      return await login('admin@bloodbank.org', 'admin123');
    } else {
      return await login('john@example.com', 'user123');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('blood_bank_token');
    sessionStorage.removeItem('blood_bank_user');
    localStorage.removeItem('blood_bank_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        googleLogin,
        register,
        sendOtp,
        verifyOtp,
        logout,
        quickDemoLogin,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
