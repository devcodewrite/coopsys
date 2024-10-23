// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import settingModel from '../models/settingModel';

// Create the Auth Context
const AuthContext = createContext();


// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const token = await settingModel.getAccessToken();
      const refreshToken = await settingModel.getRefreshToken();
      const userData = await settingModel.getUserData();

      if (token && refreshToken) {
        setUser(JSON.parse(userData)); // Parse user data if it exists
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const login = async (accessToken, refreshToken, userData) => {
    await settingModel.setAccessToken(accessToken);
    await settingModel.setRefreshToken(refreshToken);
    await settingModel.setUserData(JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await settingModel.remove('accessToken');
    await settingModel.remove('refreshToken');
    await settingModel.remove('userData');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
