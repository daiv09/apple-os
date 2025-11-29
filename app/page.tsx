// src/app/page.tsx (Modified)
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import NewDock from "@/components/New-Dock"; // Assuming NewDock exports a single component
import SpotlightSearch from "@/components/ui/mac-os/SpotlightSearch";
import { useRouter } from 'next/navigation';

// Define a Ref type for NewDock to potentially expose its functions (Unused here, but the proper pattern)
// type NewDockRef = {
//     handleAppClick: (appId: string) => void;
// };

export default function Home() {
  const router = useRouter();
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // State/Ref to hold the NewDock's app handling function
  const [newDockAppClickHandler, setNewDockAppClickHandler] = useState<((appId: string) => void) | null>(null);

  // --- UNIVERSAL ACTION HANDLER (Menu Bar, Dock, Spotlight) ---
  const handleUniversalAction = useCallback(async (actionId: string) => {

    // 1. DOCK APP ACTION (Launch or Focus an App)
    // If the action is an app ID (terminal, mail, notes, etc.)
    if (newDockAppClickHandler) {
      const isDockApp = ['finder', 'calculator', 'terminal', 'mail', 'notes', 'safari', 'photos', 'music', 'calendar'].includes(actionId);
      if (isDockApp) {
        newDockAppClickHandler(actionId);
        return;
      }
    }

    // 2. MENU BAR ACTION (System/Navigation)
    if (actionId === "dark-mode") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (actionId === "light-mode") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else if (actionId === "open-github") {
      window.open("https://github.com/daiv09", "_blank");
    } else if (actionId === "reload-portfolio") {
      window.location.reload();
    } else if (actionId.startsWith("/")) {
      // Assume paths start with /
      router.push(actionId);
    }

    // console.log(`Executing universal action: ${actionId}`);
  }, [router, newDockAppClickHandler]);
  // -----------------------------------------------------------

  // --- Keyboard Shortcut Logic: Ctrl + Alt + Space ---
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      const isAlt = e.altKey;
      const isSpace = e.code === 'Space';

      if (isCmd && isAlt && isSpace) {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const handleToggle = () => setIsSpotlightOpen(prev => !prev);
    window.addEventListener('toggle-spotlight', handleToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('toggle-spotlight', handleToggle);
    };
  }, []);

  const closeSpotlight = useCallback(() => setIsSpotlightOpen(false), []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fixed, responsive background */}
      {/* <div
          className="fixed inset-0 bg-cover bg-center -z-10" // Add pointer-events-none
          style={{
            backgroundImage: "url('./background.jpg')",
          }}
          aria-hidden="true"
        ></div> */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        {/* Ensure this file is in your 'public' folder  */}
        <source src="./video_background.mp4" type="video/mp4" />
      </video>{/* Spotlight Search */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={closeSpotlight}
        handleAppOrMenuAction={handleUniversalAction} // Pass the unified handler
      />

      {/* Navbar - Needs to dispatch toggle-spotlight event for its own menu shortcut */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center w-full pt-1 md:pt-4 lg:pt-8 snap-y snap-mandatory overflow-y-auto scroll-smooth flex-1 pb-20">
        {/* NewDock now receives a callback that it uses to expose its 
                  internal app click handler (handleAppClick) to the parent state.
                  You must modify NewDock to call setNewDockAppClickHandler inside it.
                */}
        <NewDock exposeAppClickHandler={setNewDockAppClickHandler} />
      </main>
    </div>
  );
}