"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentApp: string;
  setCurrentApp: (appName: string) => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentApp, setCurrentApp] = useState("Portfolio");
  const [isLocked, setIsLocked] = useState(false); // Default to locked state

  return (
    <AppContext.Provider value={{ 
      currentApp, 
      setCurrentApp, 
      isLocked, 
      setIsLocked 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};