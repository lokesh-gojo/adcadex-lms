import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('PrimeVector_user');
    return saved ? JSON.parse(saved) : {
      id: "1",
      name: 'Alex Johnson',
      email: 'student@demo.com',
      role: 'student',
      department: 'Computer Science',
      company: 'Prime Vector Enterprise Solutions',
      branch: 'Hosur Main Campus',
      weeklyStreak: 5,
      attendanceRate: '94%'
    };
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (API_BASE_URL) {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('PrimeVector_user', JSON.stringify(res.data.user));
          return { success: true, message: res.data.message };
        }
      }
    } catch (err) {
      // Fallback demo accounts for all 6 roles
      const demoUsers = {
        'student@demo.com': { id: "1", name: 'Alex Johnson', email: 'student@demo.com', role: 'student', department: 'Computer Science', branch: 'Hosur Main Campus', weeklyStreak: 5, attendanceRate: '94%' },
        'trainer@demo.com': { id: "2", name: 'Dr. Sarah Chen', email: 'trainer@demo.com', role: 'trainer', department: 'AI & Data Science', branch: 'Hosur Main Campus' },
        'faculty@demo.com': { id: "2", name: 'Dr. Sarah Chen', email: 'trainer@demo.com', role: 'trainer', department: 'AI & Data Science', branch: 'Hosur Main Campus' },
        'superadmin@demo.com': { id: "3", name: 'Executive Chief Admin', email: 'superadmin@demo.com', role: 'super_admin', department: 'Executive Management', branch: 'Hosur Main Campus' },
        'admin@demo.com': { id: "3", name: 'Executive Chief Admin', email: 'superadmin@demo.com', role: 'super_admin', department: 'Executive Management', branch: 'Hosur Main Campus' },
        'hr@demo.com': { id: "4", name: 'Jane Recruiter', email: 'hr@demo.com', role: 'hr_admin', department: 'Talent Acquisition', branch: 'Bangalore Tech Hub' },
        'mentor@demo.com': { id: "5", name: 'Marcus Vance', email: 'mentor@demo.com', role: 'mentor', department: 'Full Stack Engineering', branch: 'Hosur Main Campus' },
        'placement@demo.com': { id: "6", name: 'Priya Sharma', email: 'placement@demo.com', role: 'placement_officer', department: 'Corporate Relations', branch: 'Hosur Main Campus' }
      };

      const demoUser = demoUsers[email.toLowerCase()] || { name: 'Demo User', email, role: 'student', department: 'General Tech', branch: 'Hosur Main Campus' };
      setUser(demoUser);
      localStorage.setItem('PrimeVector_user', JSON.stringify(demoUser));
      return { success: true, message: `Logged in as ${demoUser.name} (${demoUser.role.toUpperCase()})` };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (newRole) => {
    const roleMap = {
      'student': { id: "1", name: 'Alex Johnson', email: 'student@demo.com', role: 'student', department: 'Computer Science', branch: 'Hosur Main Campus', weeklyStreak: 5, attendanceRate: '94%' },
      'trainer': { id: "2", name: 'Dr. Sarah Chen', email: 'trainer@demo.com', role: 'trainer', department: 'AI & Data Science', branch: 'Hosur Main Campus' },
      'super_admin': { id: "3", name: 'Executive Chief Admin', email: 'superadmin@demo.com', role: 'super_admin', department: 'Executive Management', branch: 'Hosur Main Campus' },
      'hr_admin': { id: "4", name: 'Jane Recruiter', email: 'hr@demo.com', role: 'hr_admin', department: 'Talent Acquisition', branch: 'Bangalore Tech Hub' },
      'mentor': { id: "5", name: 'Marcus Vance', email: 'mentor@demo.com', role: 'mentor', department: 'Full Stack Engineering', branch: 'Hosur Main Campus' },
      'placement_officer': { id: "6", name: 'Priya Sharma', email: 'placement@demo.com', role: 'placement_officer', department: 'Corporate Relations', branch: 'Hosur Main Campus' }
    };
    const updated = roleMap[newRole] || { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('PrimeVector_user', JSON.stringify(updated));
  };

  const register = async (name, email, password, role, companyId, branchId) => {
    setLoading(true);
    try {
      if (API_BASE_URL) {
        const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password, role, companyId, branchId });
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('PrimeVector_user', JSON.stringify(res.data.user));
          return { success: true, message: res.data.message };
        }
      }
    } catch (err) {
      const newUser = { name, email, role: role || 'student', department: 'General Tech', branch: 'Hosur Main Campus' };
      setUser(newUser);
      localStorage.setItem('PrimeVector_user', JSON.stringify(newUser));
      return { success: true, message: `Welcome to Prime Vector LMS, ${name}!` };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('PrimeVector_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

