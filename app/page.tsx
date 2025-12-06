// src/app/page.tsx (Corrected)
"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import NewDock from "@/components/New-Dock"; // Assuming NewDock exports a single component
import SpotlightSearch from "@/components/ui/mac-os/SpotlightSearch";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // 🛑 FIX 1: Removed duplicate 'useStaticBackground' state.
  // Renamed for clarity to match action handler logic:
  const [isStaticBackgroundActive, setIsStaticBackgroundActive] = useState(false);

  // State/Ref to hold the NewDock's app handling function
  const [newDockAppClickHandler, setNewDockAppClickHandler] = useState<((appId: string) => void) | null>(null);

  // --- UNIVERSAL ACTION HANDLER (Menu Bar, Dock, Spotlight) ---
  // src/app/page.tsx

  // ... (imports and state declarations)

  // --- UNIVERSAL ACTION HANDLER (Menu Bar, Dock, Spotlight) ---
  const handleUniversalAction = useCallback(async (actionId: string) => {
    // 1. **NEW: BACKGROUND ACTIONS**
    if (actionId === "set-bg-static") {
      setIsStaticBackgroundActive(true);
      return;
    }
    if (actionId === "set-bg-video") {
      setIsStaticBackgroundActive(false);
      return;
    }

    // 2. DOCK APP ACTION (Launch or Focus an App)
    const dockAppIds = ['finder', 'calculator', 'terminal', 'mail', 'notes', 'safari', 'photos', 'music', 'calendar'];
    const isDockApp = dockAppIds.includes(actionId);

    // 🔑 THE CRITICAL FIX: Ensure the handler is set AND the actionId is a valid dock app.
    if (isDockApp) {
      // 🛑 Check 1: Is the handler ready?
      if (!newDockAppClickHandler) {
        console.warn(`Attempted to launch dock app ${actionId}, but NewDock handler is not ready.`);
        return;
      }

      // 🛑 Check 2: Is the actionId valid (not null/undefined/empty string)
      if (typeof actionId === 'string' && actionId.trim().length > 0) {
        newDockAppClickHandler(actionId); // Call the handler with the valid ID
      } else {
        console.error("handleUniversalAction received invalid app ID:", actionId);
      }
      return;
    }
    // -----------------------------------------------------------

    // 3. MENU BAR ACTION (System/Navigation)
  }, [router, newDockAppClickHandler]); // Dependencies are correct
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
      {/* 🛑 CONDITIONAL BACKGROUND RENDERING 🛑 */}
      {isStaticBackgroundActive ? ( // 🛑 Use the corrected state name
        <div
          className="fixed inset-0 bg-cover bg-center -z-10"
          style={{
            backgroundImage: "url('./background.jpg')",
          }}
          aria-hidden="true"
        ></div>
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
        >
          <source src="./video_background.mp4" type="video/mp4" />
        </video>
      )}
      {/* -------------------------------------- */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={closeSpotlight}
        handleAppOrMenuAction={handleUniversalAction} // Pass the unified handler
      />

      {/* Navbar - Needs to dispatch toggle-spotlight event for its own menu shortcut */}
      <div className="relative z-50">
        <Navbar
          // 💡 Pass the unified handler to Navbar to catch all Menu Bar actions
          onMenuAction={handleUniversalAction}
          // 🛑 FIX 2: Pass the background state to Navbar for dynamic menu labels
          isStaticBackgroundActive={isStaticBackgroundActive}
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center w-full pt-1 md:pt-4 lg:pt-8 snap-y snap-mandatory overflow-y-auto scroll-smooth flex-1 pb-20">
        <NewDock
          exposeAppClickHandler={setNewDockAppClickHandler}
          isStaticBackgroundActive={isStaticBackgroundActive} // This is fine if NewDock needs it
        />
      </main>
    </div>
  );
}