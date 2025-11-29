"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
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

// Sample apps (unchanged)
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
}

const NewDock: React.FC<NewDockProps> = ({ exposeAppClickHandler }) => { // Added exposeAppClickHandler prop
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

  // --- CORE APP CLICK HANDLER (Made into useCallback for stability) ---
  const handleAppClick = useCallback((appId: string | null | undefined) => {
    // 🔑 FIX: Check if appId is valid before proceeding
    if (!appId || typeof appId !== 'string') {
        console.error("handleAppClick received invalid appId:", appId);
        return; // Exit function if appId is null, undefined, or not a string
    }
    
    // Handle quit action
    if (appId.startsWith("quit:")) {
        const realId = appId.replace("quit:", "");

        // Remove from open apps
        setOpenApps((prev) => prev.filter((id) => id !== realId));

      // Close specific popups and reset to Finder if needed
      if (realId === "terminal") {
        setShowTerminal(false);
        setCurrentApp("Finder");
      }
      if (realId === "notes") {
        setShowNotes(false);
        setCurrentApp("Finder");
      }
      if (realId === "safari") {
        setShowSafari(false);
        setCurrentApp("Finder");
      }
      if (realId === "calculator") {
        setShowCalculator(false);
        setCurrentApp("Finder");
      }
      if (realId === "photos") {
        setShowPhotos(false);
        setCurrentApp("Finder");
      }
      if (realId === "music") {
        setShowMusic(false);
        setCurrentApp("Finder");
      }
      if (realId === "mail") {
        setShowMail(false);
        setCurrentApp("Finder");
      }
      if (realId === "calendar") {
        setShowCalendar(false);
        setCurrentApp("Finder");
      }
      if (realId === "finder") {
        setShowFinder(false);
        setCurrentApp("Finder");
      }

      return; // Finished handling quit
    }

    // TERMINAL
    if (appId === "terminal") {
      const isRunning = openApps.includes("terminal");

      // If Terminal is running and visible → minimize
      if (isRunning && showTerminal && !isTerminalMinimized) {
        setIsTerminalMinimized(true);
        setCurrentApp("Finder");
        return;
      }

      // If Terminal is running but minimized → restore
      if (isRunning && isTerminalMinimized) {
        setIsTerminalMinimized(false);
        setShowTerminal(true);
        setCurrentApp("Terminal");
        return;
      }

      // If Terminal is NOT running → launch it
      if (!isRunning) {
        setOpenApps((prev) => [...prev, "terminal"]); // show dot
      }

      // Show terminal window
      setShowTerminal(true);
      setIsTerminalMinimized(false);
      setCurrentApp("Terminal");
      return;
    }

    // MAIL
    if (appId === "mail") {
      const isRunning = openApps.includes("mail");

      if (isRunning && showMail) {
        setShowMail(false);
        setCurrentApp("Finder");
        return;
      }

      if (isRunning && !showMail) {
        setShowMail(true);
        setCurrentApp("Mail");
        return;
      }

      setOpenApps((prev) => [...prev, "mail"]);
      setShowMail(true);
      setCurrentApp("Mail");
      return;
    }

    // NOTES
    if (appId === "notes") {
      const isRunning = openApps.includes("notes");

      // If running and visible → close
      if (isRunning && showNotes) {
        setShowNotes(false);
        setCurrentApp("Finder");
        return;
      }

      // If running but hidden → show
      if (isRunning && !showNotes) {
        setShowNotes(true);
        setCurrentApp("Notes");
        return;
      }

      // If not running → add to dock + open
      if (!isRunning) {
        setOpenApps((prev) => [...prev, "notes"]);
      }

      setShowNotes(true);
      setCurrentApp("Notes");
      return;
    }

    // SAFARI
    if (appId === "safari") {
      const isRunning = openApps.includes("safari");

      if (isRunning && showSafari) {
        setShowSafari(false);
        setCurrentApp("Finder");
        return;
      }

      if (isRunning && !showSafari) {
        setShowSafari(true);
        setCurrentApp("Safari");
        return;
      }

      setOpenApps((prev) => [...prev, "safari"]);
      setShowSafari(true);
      setCurrentApp("Safari");
      return;
    }

    // CALCULATOR
    if (appId === "calculator") {
      const isRunning = openApps.includes("calculator");

      if (isRunning && showCalculator) {
        setShowCalculator(false);
        setCurrentApp("Finder");
        return;
      }

      if (isRunning && !showCalculator) {
        setShowCalculator(true);
        setCurrentApp("Calculator");
        return;
      }

      setOpenApps((prev) => [...prev, "calculator"]);
      setShowCalculator(true);
      setCurrentApp("Calculator");
      return;
    }

    // PHOTOS
    if (appId === "photos") {
      const isRunning = openApps.includes("photos");

      if (isRunning && showPhotos) {
        setShowPhotos(false);
        setCurrentApp("Finder");
        return;
      }

      if (isRunning && !showPhotos) {
        setShowPhotos(true);
        setCurrentApp("Photos");
        return;
      }

      setOpenApps((prev) => [...prev, "photos"]);
      setShowPhotos(true);
      setCurrentApp("Photos");
      return;
    }

    // MUSIC
    if (appId === "music") {
      const isRunning = openApps.includes("music");

      if (isRunning && showMusic) {
        setShowMusic(false);
        setCurrentApp("Finder");
        return;
      }

      if (isRunning && !showMusic) {
        setShowMusic(true);
        setCurrentApp("Music");
        return;
      }

      setOpenApps((prev) => [...prev, "music"]);
      setShowMusic(true);
      setCurrentApp("Music");
      return;
    }

    // CALENDAR
    if (appId === "calendar") {
      const isRunning = openApps.includes("calendar");

      if (isRunning && showCalendar) {
        setShowCalendar(false);
        setCurrentApp("Finder");
        return;
      }

      if (isRunning && !showCalendar) {
        setShowCalendar(true);
        setCurrentApp("Calendar");
        return;
      }

      setOpenApps((prev) => [...prev, "calendar"]);
      setShowCalendar(true);
      setCurrentApp("Calendar");
      return;
    }

    // FINDER
    if (appId === "finder") {
      const isRunning = openApps.includes("finder");

      if (isRunning && showFinder) {
        setShowFinder(false);
        setCurrentApp("Finder");
        return;
      }

      if (isRunning && !showFinder) {
        setShowFinder(true);
        setCurrentApp("Finder");
        return;
      }

      setOpenApps((prev) => [...prev, "finder"]);
      setShowFinder(true);
      setCurrentApp("Finder");
      return;
    }

    // All OTHER apps still toggle normally:
    setOpenApps((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  }, [openApps, showTerminal, isTerminalMinimized, showNotes, showSafari, showCalculator, showPhotos, showMusic, showMail, showCalendar, showFinder, setCurrentApp]);

  // --- 🔑 EXPOSE HANDLER TO PARENT COMPONENT ---
  useEffect(() => {
    // This effect runs once after the initial render to register the handler.
    // It runs again if handleAppClick dependency changes (which shouldn't happen 
    // often due to useCallback and its deps)
    exposeAppClickHandler(handleAppClick);
  }, [exposeAppClickHandler, handleAppClick]);


  return (
    <>
      {/* Terminal Popup (only shown if running AND not minimized) */}
      {openApps.includes("terminal") &&
        showTerminal &&
        !isTerminalMinimized && (
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
        className="fixed left-0 bottom-0 w-full h-8 z-[9998]"
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
          fixed left-0 w-full flex items-center justify-center z-[9999]
          transition-all duration-300
          ${dockVisible ? "bottom-0 opacity-100" : "-bottom-20 opacity-0 pointer-events-none"}
        `}
        style={{ height: "80px" }}
      >
        <MacOSDock
          apps={sampleApps}
          onAppClick={handleAppClick}
          openApps={openApps}
        />
      </div>
    </>
  );
};

export default NewDock;