import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

type UserType = 'admin' | 'doctor' | 'patient' | null;

interface AuthContextType {
  userType: UserType;
  isAuthenticated: boolean;
  login: (type: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') as UserType;
    if (storedUserType) {
      setUserType(storedUserType);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback((type: UserType) => {
    setUserType(type);
    setIsAuthenticated(true);
    localStorage.setItem('userType', type as string);
  }, []);

  const logout = useCallback(() => {
    setUserType(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userType');
  }, []);

  const contextValue = useMemo(() => ({
    userType,
    isAuthenticated,
    login,
    logout
  }), [userType, isAuthenticated, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};