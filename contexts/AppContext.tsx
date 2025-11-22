"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentApp: string;
  setCurrentApp: (appName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentApp, setCurrentApp] = useState("Daiwiik Harihar's Portfolio");

  return (
    <AppContext.Provider value={{ currentApp, setCurrentApp }}>
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
