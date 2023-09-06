/* This was supposed to be a global state to check whether a user is logged in or not. But unfortunately, due to the 
lack of tokens sent from the API to put into a localstorage, I could not implement it into the application. */
// Inside LoggedInProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoggedInContextType {
  loggedIn: boolean;
  login: () => void; 
  logout: () => void; 
}

const LoggedInContext = createContext<LoggedInContextType | undefined>(undefined);

interface LoggedInProviderProps {
  children: ReactNode;
}

export const LoggedInProvider: React.FC<LoggedInProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedInState] = useState(() => {
    
    return document.cookie.includes('fetch-access-token');
  });

  useEffect(() => {
    const checkLoginTimeout = () => {
      
      setLoggedInState(false);
    };

    const interval = setInterval(checkLoginTimeout, 3600000); // 3600000 ms = 1 hour

    return () => {
      clearInterval(interval);
    };
  }, []);

  const login = () => {
   
    setLoggedInState(true);
  };

  const logout = () => {
   
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
