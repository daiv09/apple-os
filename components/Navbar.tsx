"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import MacOSMenuBar from "@/components/ui/mac-os/mac-os-menu-bar";
import { useFullscreen } from "@/app/FullscreenContext";

interface NavbarProps {
  onVisibilityChange?: (visible: boolean) => void;
  onMenuAction: (actionId: string) => Promise<void>;
  isStaticBackgroundActive: boolean;
}

export default function Navbar({ onVisibilityChange, onMenuAction, isStaticBackgroundActive }: NavbarProps) {
  const { isFullscreen, setNavbarVisible } = useFullscreen();
  
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  
  const [showBar, setShowBar] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  // 1. Determine final visibility during render to avoid cascading effects
  // This ensures the bar is ALWAYS visible if not in fullscreen or if on mobile.
  const isActuallyVisible = useMemo(() => {
    if (isMobile) return true;
    if (!isFullscreen) return true;
    return showBar;
  }, [isMobile, isFullscreen, showBar]);

  // Detect mobile screens
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // 2. Notify parent + sync context with the DERIVED visibility
  useEffect(() => {
    setNavbarVisible(isActuallyVisible);
    onVisibilityChange?.(isActuallyVisible);
  }, [isActuallyVisible, setNavbarVisible, onVisibilityChange]);

  // 3. Auto-hide logic (Desktop + Fullscreen only)
  useEffect(() => {
    // Only run mouse tracking if we are in a state where hiding is possible
    if (isMobile || !isFullscreen) return;

    const handleMouseMove = (e: MouseEvent) => {
      // reveal if cursor is at the top 3px
      if (e.clientY <= 3) {
        if (!showBar) setShowBar(true);
        return;
      }

      const NAV_HEIGHT = 40;
      const navBottom = showBar ? NAV_HEIGHT : 0;

      // Keep visible if hovering over the navbar area
      if (e.clientY <= navBottom) {
        if (!showBar) setShowBar(true);
        return;
      }

      // Otherwise hide
      if (showBar) setShowBar(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isFullscreen, isMobile, showBar]);

  return (
    <div
      ref={navRef}
      style={{
        position: "fixed",
        top: isActuallyVisible ? 0 : -40,
        left: 0,
        width: "100%",
        height: "40px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isActuallyVisible ? 1 : 0,
        transition: "top 0.25s ease, opacity 0.25s ease",
        pointerEvents: isActuallyVisible ? "auto" : "none",
      }}
    >
      <div style={{ width: "100%", padding: isMobile ? "0 4px" : "0 16px" }}>
        <MacOSMenuBar
          onMenuAction={onMenuAction}
          isStaticBackgroundActive={isStaticBackgroundActive}
        />
      </div>
    </div>
  );
}