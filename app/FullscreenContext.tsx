"use client";

import React, { createContext, useContext, useState } from "react";

interface FullscreenContextType {
  isFullscreen: boolean;
  setFullscreen: (v: boolean) => void;

  navbarVisible: boolean;
  setNavbarVisible: (v: boolean) => void;

  dockVisible: boolean;
  setDockVisible: (v: boolean) => void;
}

const FullscreenContext = createContext<FullscreenContextType | null>(null);

export const FullscreenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isFullscreen, setFullscreen] = useState(false);

  // Navbar is visible by default (macOS-like behavior)
  const [navbarVisible, setNavbarVisible] = useState(true);

  // Dock is visible by default
  const [dockVisible, setDockVisible] = useState(true);

  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        setFullscreen,

        navbarVisible,
        setNavbarVisible,

        dockVisible,
        setDockVisible,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => {
  const ctx = useContext(FullscreenContext);
  if (!ctx) {
    throw new Error("useFullscreen must be used inside FullscreenProvider");
  }
  return ctx;
};
