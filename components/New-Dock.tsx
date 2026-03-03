"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation"; // ⬅️ add this
import MacOSDock from "./mac-os-dock";
import TerminalPopup from "./ui/TerminalPopup";
import NotesPopup from "./ui/mac-os/NotesPopup";
import SafariPopup from "./ui/mac-os/SafariPopup";
import CalculatorPopup from "./ui/CalculatorPopup";
import PhotosPopup from "./ui/mac-os/PhotosPopup";
import MusicPopup from "./ui/mac-os/MusicPopup";
import MailPopup from "./ui/mac-os/MailPopup";
import CalendarPopup from "./ui/mac-os/CalenderPopup";
import FinderPopup from "./ui/mac-os/FinderPopup";
import { useFullscreen } from "@/app/FullscreenContext";
import { useApp } from '@/contexts/AppContext';

const sampleApps = [
  {
    id: "finder",
    name: "Finder",
    icon: "https://cdn.jim-nielsen.com/macos/1024/finder-2021-09-10.png?rf=1024",
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: "https://cdn.jim-nielsen.com/macos/1024/calculator-2021-04-29.png?rf=1024",
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "https://cdn.jim-nielsen.com/macos/1024/terminal-2021-06-03.png?rf=1024",
  },
  {
    id: "mail",
    name: "Mail",
    icon: "https://cdn.jim-nielsen.com/macos/1024/mail-2021-05-25.png?rf=1024",
  },
  {
    id: "notes",
    name: "Notes",
    icon: "https://cdn.jim-nielsen.com/macos/1024/notes-2021-05-25.png?rf=1024",
  },
  {
    id: "safari",
    name: "Safari",
    icon: "https://cdn.jim-nielsen.com/macos/1024/safari-2021-06-02.png?rf=1024",
  },
  {
    id: "photos",
    name: "Photos",
    icon: "https://cdn.jim-nielsen.com/macos/1024/photos-2021-05-28.png?rf=1024",
  },
  {
    id: "music",
    name: "Music",
    icon: "https://cdn.jim-nielsen.com/macos/1024/music-2021-05-25.png?rf=1024",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "https://cdn.jim-nielsen.com/macos/1024/calendar-2021-04-29.png?rf=1024",
  }
];

// Define the type for the exposed handler (App ID string)
type AppClickHandler = (appId: string) => void;

// Define the component props
interface NewDockProps {
  exposeAppClickHandler: React.Dispatch<React.SetStateAction<AppClickHandler | null>>;
  isStaticBackgroundActive: boolean; // Add this prop to receive background state
}

const NewDock: React.FC<NewDockProps> = ({ exposeAppClickHandler, isStaticBackgroundActive }: NewDockProps) => { // Added exposeAppClickHandler prop
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);

  const [showNotes, setShowNotes] = useState(false);
  const [showSafari, setShowSafari] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showMail, setShowMail] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFinder, setShowFinder] = useState(true); // Finder open by default

  const dockRef = useRef<HTMLDivElement>(null);

  const router = useRouter();               // ⬅️ router instance
  const { setCurrentApp } = useApp();
  const { isFullscreen, dockVisible, setDockVisible } = useFullscreen();

  // --- DOCK AUTOHIDE LOGIC (Unchanged) ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dock = dockRef.current;
      if (!dock) return;

      const dockRect = dock.getBoundingClientRect();

      // 1) Not fullscreen → dock must always be visible
      if (!isFullscreen) {
        setDockVisible(true);
        return;
      }

      // 2) If cursor is INSIDE the dock → keep it visible
      if (
        e.clientX >= dockRect.left &&
        e.clientX <= dockRect.right &&
        e.clientY >= dockRect.top &&
        e.clientY <= dockRect.bottom
      ) {
        setDockVisible(true);
        return;
      }

      // 3) If cursor touches bottom edge → show dock
      if (e.clientY >= window.innerHeight - 5) {
        setDockVisible(true);
        return;
      }

      // 4) Cursor outside dock + not at bottom → hide
      setDockVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isFullscreen, setDockVisible]);

  // 1. Move the State Mapper inside useMemo at the top of your component
const appStates = useMemo(() => ({
  finder: { show: showFinder, setter: setShowFinder },
  calculator: { show: showCalculator, setter: setShowCalculator },
  terminal: { show: showTerminal, setter: setShowTerminal, minimized: isTerminalMinimized, setMinimized: setIsTerminalMinimized },
  notes: { show: showNotes, setter: setShowNotes },
  safari: { show: showSafari, setter: setShowSafari },
  photos: { show: showPhotos, setter: setShowPhotos },
  music: { show: showMusic, setter: setShowMusic },
  mail: { show: showMail, setter: setShowMail },
  calendar: { show: showCalendar, setter: setShowCalendar },
}), [showFinder, showCalculator, showTerminal, isTerminalMinimized, showNotes, showSafari, showPhotos, showMusic, showMail, showCalendar]);

// 2. Optimized handleAppClick
const handleAppClick = useCallback((appId: string) => {
  if (typeof appId !== 'string' || !appId.trim()) return;

  // Global Actions
  if (appId === "minimize-all" || appId === "close-all") {
    router.push("/");
    Object.values(appStates).forEach(app => {
      app.setter(false);
      if ('setMinimized' in app) app.setMinimized(false);
    });
    setOpenApps([]);
    setCurrentApp("Finder");
    return;
  }

  // Handle Quit
  if (appId.startsWith("quit:")) {
    const realId = appId.replace("quit:", "");
    setOpenApps((prev) => prev.filter((id) => id !== realId));
    const config = appStates[realId as keyof typeof appStates];
    if (config) config.setter(false);
    setCurrentApp("Finder");
    return;
  }

  // Handle Apps
  const isRunning = openApps.includes(appId);
  const config = appStates[appId as keyof typeof appStates];

  if (!config) return;

  if (appId === "terminal" && isRunning) {
  if (config && 'minimized' in config && 'setMinimized' in config) {
    if (config.show && !config.minimized) {
      config.setMinimized(true);
      setCurrentApp("Finder");
    } else {
      config.setMinimized(false);
      config.setter(true);
      setCurrentApp("Terminal");
    }
  }
  return;
}

  if (isRunning) {
    config.setter(!config.show);
    setCurrentApp(config.show ? "Finder" : appId.charAt(0).toUpperCase() + appId.slice(1));
  } else {
    setOpenApps((prev) => [...prev, appId]);
    config.setter(true);
    setCurrentApp(appId.charAt(0).toUpperCase() + appId.slice(1));
  }
}, [openApps, router, setCurrentApp, appStates]); 

useEffect(() => {
  exposeAppClickHandler(() => handleAppClick); 
}, [exposeAppClickHandler, handleAppClick]);

  useEffect(() => {
    exposeAppClickHandler(handleAppClick);
  }, [exposeAppClickHandler, handleAppClick]);

  const filteredApps = sampleApps.filter(app => app && app.id && typeof app.id === 'string');
  return (
    <>
      {openApps.includes("terminal") && showTerminal && !isTerminalMinimized && (
        <TerminalPopup
          onClose={() => {
            setShowTerminal(false);
            setIsTerminalMinimized(false);
            setOpenApps((prev) => prev.filter((id) => id !== "terminal")); // remove dot
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {/* Notes Popup (only shown if running) */}
      {openApps.includes("notes") && showNotes && (
        <NotesPopup
          onClose={() => {
            setShowNotes(false);
            setOpenApps((prev) => prev.filter((id) => id !== "notes")); // remove dot
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {openApps.includes("safari") && showSafari && (
        <SafariPopup
          onClose={() => {
            setShowSafari(false);
            setOpenApps((prev) => prev.filter((id) => id !== "safari"));
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {openApps.includes("calculator") && showCalculator && (
        <CalculatorPopup
          onClose={() => {
            setShowCalculator(false);
            setOpenApps((prev) => prev.filter((id) => id !== "calculator"));
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {openApps.includes("photos") && showPhotos && (
        <PhotosPopup
          onClose={() => {
            setShowPhotos(false);
            setOpenApps((prev) => prev.filter((id) => id !== "photos"));
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {openApps.includes("music") && showMusic && (
        <MusicPopup
          onClose={() => {
            setShowMusic(false);
            setOpenApps((prev) => prev.filter((id) => id !== "music"));
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {openApps.includes("mail") && showMail && (
        <MailPopup
          onClose={() => {
            setShowMail(false);
            setOpenApps((prev) => prev.filter((id) => id !== "mail"));
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {openApps.includes("calendar") && showCalendar && (
        <CalendarPopup
          onClose={() => {
            setShowCalendar(false);
            setOpenApps((prev) => prev.filter((id) => id !== "calendar"));
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {openApps.includes("finder") && showFinder && (
        <FinderPopup
          onClose={() => {
            setShowFinder(false);
            setOpenApps((prev) => prev.filter((id) => id !== "finder"));
            setDockVisible(true);
            setCurrentApp("Finder");
          }}
        />
      )}

      {/* Fullscreen mouse detector */}
      <div
        className="fixed left-0 bottom-0 w-full h-8 z-9998"
        style={{ pointerEvents: "auto" }}
        onMouseMove={(e) => {
          if (!isFullscreen) {
            setDockVisible(true);
            return;
          }
          // Only really needed if the detector is thin, or you want to double-check:
          if (e.clientY >= window.innerHeight - 8) {
            setDockVisible(true);
          }
        }}
      />

      {/* Dock */}
      <div
        ref={dockRef}
        className={`
    fixed left-0 w-full flex items-center justify-center z-9999 // 🛑 Keep z-index here
    transition-all duration-300
    ${dockVisible ? "bottom-0 opacity-100" : "-bottom-20 opacity-0 pointer-events-none"}
  `}
        style={{ height: "80px" }}
      >
        <MacOSDock
          apps={filteredApps}
          onAppClick={handleAppClick}
          openApps={openApps}
        />
      </div>
    </>
  );
};

export default NewDock;