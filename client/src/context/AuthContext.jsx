import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('acadex_user') || localStorage.getItem('PrimeVector_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
        email: email.trim(), 
        password 
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('acadex_user', JSON.stringify(res.data.user));
        if (res.data.token) {
          localStorage.setItem('acadex_token', res.data.token);
        }
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Authentication failed.' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || (err.request ? 'Unable to reach backend server. Please verify the API is running.' : err.message);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, companyId, branchId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { 
        name: name.trim(), 
        email: email.trim(), 
        password,
        companyId, 
        branchId 
      });

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('acadex_user', JSON.stringify(res.data.user));
        if (res.data.token) {
          localStorage.setItem('acadex_token', res.data.token);
        }
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Registration failed.' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || (err.request ? 'Unable to connect to server.' : err.message);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('acadex_user');
    localStorage.removeItem('acadex_token');
    localStorage.removeItem('PrimeVector_user');
    localStorage.removeItem('PrimeVector_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
