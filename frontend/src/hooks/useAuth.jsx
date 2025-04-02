import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = "http://localhost:8080/api";

// Create context
const AuthContext = createContext();
// Custom hook to use the auth context
export const useAuth = () => {
    const navigate = useNavigate();
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      
      if (token && username) {
        setUser({ username });
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { 
        username, 
        password 
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', response.data.user.role);
        const role = response.data.user.role;
        setUser({ username,role:role });
        return response.data;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Register function
  const register = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { 
        username, 
        password 
      });
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
    toast.success("Logout successful"); // Show success message
    setTimeout(() => {
        navigate("/login"); // Ensure it redirects to login
      }, 1000);
  };

  // Get auth token for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Context value
  const value = {
    user,
    login,
    register,
    logout,
    getAuthHeader,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};