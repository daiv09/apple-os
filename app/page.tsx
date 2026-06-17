"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import SystemSettings from "@/components/ui/mac-os/Settings";

// Component Imports
import Navbar from "@/components/Navbar";
import NewDock from "@/components/New-Dock";
import SpotlightSearch from "@/components/ui/mac-os/SpotlightSearch";
import LockScreen from "@/components/ui/mac-os/LockScreen";

export default function Home() {
  const router = useRouter();
  const { isLocked, setIsLocked } = useApp();
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isStaticBackgroundActive, setIsStaticBackgroundActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // 🛑 State for Settings visibility
  const [newDockAppClickHandler, setNewDockAppClickHandler] = useState<((appId: string) => void) | null>(null);

  // --- UNIVERSAL ACTION HANDLER ---
  const handleUniversalAction = useCallback(async (actionId: string) => {

    if (actionId === "open-settings") {
      setIsSettingsOpen(true);
      return;
    }
    if (actionId === "set-bg-static") {
      setIsStaticBackgroundActive(true);
      return;
    }
    if (actionId === "set-bg-video") {
      setIsStaticBackgroundActive(false);
      return;
    }
    if (actionId === "lock-screen") {
      setIsLocked(true); 
      return;
    }
    if (actionId === "system-restart") {
      window.location.reload();
      return;
    }

    const dockAppIds = ['finder', 'calculator', 'terminal', 'mail', 'notes', 'safari', 'photos', 'music', 'calendar'];
    if (dockAppIds.includes(actionId) && newDockAppClickHandler) {
      newDockAppClickHandler(actionId);
      return;
    }

    if (actionId.startsWith("go-")) {
      const path = actionId.replace("go-", "");
      router.push(`/${path === 'home' ? '' : path}`);
    }
  }, [newDockAppClickHandler, setIsLocked, router]);

  // --- Shortcut & Event Listeners ---
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.altKey && e.code === 'Space') {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      
      {/* 🛑 FIXED BACKGROUND LAYER 🛑 */}
      {/* Position fixed ensures it covers the entire viewport regardless of scrolling/nesting */}
    {/* 🛑 FIXED BACKGROUND LAYER 🛑 */}
{/* Position fixed ensures it covers the entire viewport regardless of scrolling/nesting */}
<div className="fixed inset-0 pointer-events-none z-0">
  {isStaticBackgroundActive ? (
    <div
      className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
      // 1. Paste your Vercel Blob URL for background.jpg here:
      style={{ backgroundImage: "url('https://fwhxukzosp5gnmgn.public.blob.vercel-storage.com/apple-os/background.jpg')" }}
    />
  ) : (
    <video
      autoPlay 
      loop 
      muted 
      playsInline 
      preload="auto"
      // 2. Use the image as a poster so the user sees it INSTANTLY while the video buffers:
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      style={{ WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
    >
      {/* 3. Paste your Vercel Blob URL for compressed_video_background.mp4 here: */}
      <source src="https://fwhxukzosp5gnmgn.public.blob.vercel-storage.com/apple-os/compressed_video_background.mp4" type="video/mp4" />
    </video>
  )}
  {/* Subtle overlay to prevent background from overpowering UI text */}
  <div className="absolute inset-0 bg-black/10 z-10" />
</div>

      {/* 🖥️ UI OVERLAYS (Locked or Unlocked) */}
      <div className="relative z-20 h-screen w-full">
        <AnimatePresence mode="wait">
          {isLocked ? (
            <LockScreen 
              key="lock-screen" 
              onUnlock={() => setIsLocked(false)} 
              isStaticBackgroundActive={isStaticBackgroundActive} 
            />
          ) : (
            <motion.div
              key="desktop"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full flex flex-col"
            >
              <SpotlightSearch
                isOpen={isSpotlightOpen}
                onClose={closeSpotlight}
                handleAppOrMenuAction={handleUniversalAction}
              />

              <Navbar
                onMenuAction={handleUniversalAction}
                isStaticBackgroundActive={isStaticBackgroundActive}
              />
  
              <main className="flex-1 overflow-hidden relative">
                 {/* 🛑 RENDER SYSTEM SETTINGS HERE 🛑 */}
                 <AnimatePresence>
                   {isSettingsOpen && (
                     <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
                       <div className="pointer-events-auto">
                         <SystemSettings 
                           onClose={() => setIsSettingsOpen(false)}
                           isStaticBackgroundActive={isStaticBackgroundActive}
                           setIsStaticBackgroundActive={setIsStaticBackgroundActive}
                         />
                       </div>
                     </div>
                   )}
                 </AnimatePresence>
              </main>

              <div className="pb-4 flex justify-center">
                <NewDock
                  exposeAppClickHandler={setNewDockAppClickHandler}
                  isStaticBackgroundActive={isStaticBackgroundActive}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}