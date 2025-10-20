import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken')); 

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/login', { username, password });
      
      const { token: authToken } = response.data;
      
      setToken(authToken);

      return true; // Sucesso
    } catch (error) {
      console.error("Falha no login", error);
      setToken(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error("Falha no logout no servidor", error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token, 
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};