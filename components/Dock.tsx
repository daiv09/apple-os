import React, { useState } from "react";
import MacOSDock from "./ui/mac-os/mac-os-dock";
import TerminalPopup from "./ui/TerminalPopup";
import NotesPopup from "./ui/mac-os/NotesPopup";
import SafariPopup from "./ui/mac-os/SafariPopup";
import CalculatorPopup from "./ui/CalculatorPopup";
import PhotosPopup from "./ui/mac-os/PhotosPopup";
import MusicPopup from "./ui/mac-os/MusicPopup";
import MailPopup from "./ui/mac-os/MailPopup";
import { Mail } from "lucide-react";

// Sample app data with actual macOS-style icons
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
  },
];

const Dock: React.FC = () => {
  const [openApps, setOpenApps] = useState<string[]>([""]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showSafari, setShowSafari] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showMail, setShowMail] = useState(false);

  const handleAppClick = (appId: string) => {
    if (appId === "terminal") {
      const isRunning = openApps.includes("terminal");

      // If Terminal is running and visible → minimize
      if (isRunning && showTerminal && !isTerminalMinimized) {
        setIsTerminalMinimized(true);
        return;
      }

      // If Terminal is running but minimized → restore
      if (isRunning && isTerminalMinimized) {
        setIsTerminalMinimized(false);
        setShowTerminal(true);
        return;
      }

      // If Terminal is NOT running → launch it
      if (!isRunning) {
        setOpenApps(prev => [...prev, "terminal"]); // show dot
      }

      // Show terminal window
      setShowTerminal(true);
      setIsTerminalMinimized(false);
      return;
    }

    if (appId === "notes") {
      const isRunning = openApps.includes("notes");

      // If running and visible → close
      if (isRunning && showNotes) {
        setShowNotes(false);
        return;
      }

      // If running but hidden → show
      if (isRunning && !showNotes) {
        setShowNotes(true);
        return;
      }

      // If not running → add to dock + open
      if (!isRunning) {
        setOpenApps(prev => [...prev, "notes"]);
      }

      setShowNotes(true);
      return;
    }

    if (appId === "safari") {
      const isRunning = openApps.includes("safari");

      if (isRunning && showSafari) return setShowSafari(false);
      if (isRunning && !showSafari) return setShowSafari(true);

      setOpenApps(prev => [...prev, "safari"]);
      setShowSafari(true);
      return;
    }

    if (appId === "calculator") {
      const isRunning = openApps.includes("calculator");

      if (isRunning && showCalculator) return setShowCalculator(false);
      if (isRunning && !showCalculator) return setShowCalculator(true);

      setOpenApps(prev => [...prev, "calculator"]);
      setShowCalculator(true);
      return;
    }

    if (appId === "photos") {
      const isRunning = openApps.includes("photos");
      if (isRunning && showPhotos) return setShowPhotos(false);
      if (isRunning && !showPhotos) return setShowPhotos(true);

      setOpenApps(prev => [...prev, "photos"]);
      setShowPhotos(true);
      return;
    }

    if (appId === "music") {
      const isRunning = openApps.includes("music");
      if (isRunning && showMusic) return setShowMusic(false);
      if (isRunning && !showMusic) return setShowMusic(true);

      setOpenApps(prev => [...prev, "music"]);
      setShowMusic(true);
      return;
    }

    if (appId === "mail") {
      const isRunning = openApps.includes("mail");
      if (isRunning && showMail) return setShowMail(false);
      if (isRunning && !showMail) return setShowMail(true);

      setOpenApps((prev) => [...prev, "mail"]);
      setShowMail(true);
      return;
    }
    // All OTHER apps still toggle normally:
    setOpenApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

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
            }}
          />
        )}

      {/* Notes Popup (only shown if running) */}
      {openApps.includes("notes") && showNotes && (
        <NotesPopup
          onClose={() => {
            setShowNotes(false);
            setOpenApps((prev) => prev.filter((id) => id !== "notes")); // remove dot
          }}
        />
      )}

      {openApps.includes("safari") && showSafari && (
        <SafariPopup
          onClose={() => {
            setShowSafari(false);
            setOpenApps((prev) => prev.filter((id) => id !== "safari"));
          }}
        />
      )}

      {openApps.includes("calculator") && showCalculator && (
        <CalculatorPopup
          onClose={() => {
            setShowCalculator(false);
            setOpenApps((prev) => prev.filter((id) => id !== "calculator"));
          }}
        />
      )}

      {openApps.includes("photos") && showPhotos && (
        <PhotosPopup
          onClose={() => {
            setShowPhotos(false);
            setOpenApps((prev) => prev.filter((id) => id !== "photos"));
          }}
        />
      )}

      {openApps.includes("music") && showMusic && (
        <MusicPopup
          onClose={() => {
            setShowMusic(false);
            setOpenApps((prev) => prev.filter((id) => id !== "music"));
          }}
        />
      )}

      {openApps.includes("mail") && showMail && (
        <MailPopup
          onClose={() => {
            setShowMusic(false);
            setOpenApps((prev) => prev.filter((id) => id !== "music"));
          }}
        />
      )}

      {/* Dock */}
      <div className="fixed bottom-0 left-0 w-full flex items-center justify-center mb-[5px] z-50">
        <MacOSDock
          apps={sampleApps}
          onAppClick={handleAppClick}
          openApps={openApps}
        />
      </div>
    </>
  );
};

export default Dock;


