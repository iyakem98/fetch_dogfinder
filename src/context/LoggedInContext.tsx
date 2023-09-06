// Inside LoggedInProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoggedInContextType {
  loggedIn: boolean;
  login: () => void; // Define a login function
  logout: () => void; // Define a logout function
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined);

interface LoggedInProviderProps {
  children: ReactNode;
}

export const LoggedInProvider: React.FC<LoggedInProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedInState] = useState(() => {
    // Initialize loggedIn based on the presence of the fetch-access-token cookie
    return document.cookie.includes('fetch-access-token');
  });

  useEffect(() => {
    const checkLoginTimeout = () => {
      // After an hour, automatically log out the user
      setLoggedInState(false);
    };

    const interval = setInterval(checkLoginTimeout, 3600000); // 3600000 ms = 1 hour

    return () => {
      clearInterval(interval);
    };
  }, []);

  const login = () => {
    // Perform any login logic here, and then set loggedIn to true
    setLoggedInState(true);
  };

  const logout = () => {
    // Perform any logout logic here, and then set loggedIn to false
    setLoggedInState(false);
  };

  return (
    <LoggedInContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </LoggedInContext.Provider>
  );
};

export const useLoggedIn = (): LoggedInContextType => {
  const context = useContext(LoggedInContext);
  if (!context) {
    throw new Error('useLoggedIn must be used within a LoggedInProvider');
  }
  return context;
};
