"use client";
import React, { useEffect, useRef, useState } from "react";
import MacOSMenuBar from "@/components/ui/mac-os/mac-os-menu-bar";
import { useFullscreen } from "@/app/FullscreenContext";

interface NavbarProps {
  onVisibilityChange?: (visible: boolean) => void;
}

export default function Navbar({ onVisibilityChange }: NavbarProps) {
  const { isFullscreen, setNavbarVisible } = useFullscreen();
  const [showBar, setShowBar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Detect mobile screens
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Notify parent + sync context
  useEffect(() => {
    setNavbarVisible(showBar);
    onVisibilityChange?.(showBar);
  }, [showBar]);

  // Auto-hide (desktop only)
  useEffect(() => {
    if (isMobile) {
      setShowBar(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isFullscreen) {
        setShowBar(true);
        return;
      }

      // ⭐ macOS logic:
      // ─ Cursor at the top 3px → reveal
      if (e.clientY <= 3) {
        if (!showBar) setShowBar(true);
        return;
      }

      const nav = navRef.current;
      if (!nav) return;

      // Get the *intended* nav height (fixed 40px)
      const NAV_HEIGHT = 40;
      const navBottom = showBar ? NAV_HEIGHT : 0;

      // If cursor is inside navbar's vertical space → keep visible
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

  // When exiting fullscreen — always show
  useEffect(() => {
    if (!isFullscreen) {
      setShowBar(true);
    }
  }, [isFullscreen]);

  return (
    <div
      ref={navRef}
      style={{
        position: "fixed",
        top: showBar ? 0 : -40,
        left: 0,
        width: "100%",
        height: "40px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: showBar ? 1 : 0,
        transition: "top 0.25s ease, opacity 0.25s ease",
        pointerEvents: showBar ? "auto" : "none",
      }}
    >
      <div style={{ width: "100%", padding: isMobile ? "0 4px" : "0 16px" }}>
        <MacOSMenuBar
          onMenuAction={(action) => console.log("Menu action:", action)}
        />
      </div>
    </div>
  );
}
