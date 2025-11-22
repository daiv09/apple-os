"use client";

import React, { useRef, useState } from "react";
import { TerminalDemo } from "./TerminalContent";
import { useFullscreen } from "@/app/FullscreenContext";
import { motion } from "motion/react";

const TerminalPopup = ({ onClose }: { onClose: () => void }) => {
  const { navbarVisible, setFullscreen, setNavbarVisible, setDockVisible } =
    useFullscreen();

  const [zoomed, setZoomed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const popupRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
      className={`
        fixed z-[9999] shadow-2xl bg-white text-black overflow-hidden
        transition-all duration-300 rounded-xl
        ${
          zoomed
            ? `left-0 w-screen h-screen translate-x-0 translate-y-0 rounded-none 
               ${navbarVisible ? "top-[40px]" : "top-0"}`
            : minimized
              ? "top-1/2 left-1/2 w-[180px] h-[40px] -translate-x-1/2 -translate-y-1/2 rounded-lg"
              : "top-24 right-8 md:top-28 md:right-12 lg:top-32 lg:right-16 w-[700px] h-[450px]"
        }
      `}
    >
      {/* Title Bar */}
      <div className="border-border flex flex-col gap-y-1 border-b px-4 py-2 select-none">
        <div className="flex flex-row gap-x-2 items-center">
          {/* FULL FIXED CLOSE BUTTON */}
          <div
            onClick={() => {
              if (zoomed) {
                setFullscreen(false);
                setNavbarVisible(true);
                setDockVisible(true);
              }
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-[#ff5f57] cursor-pointer"
          />

          {/* Minimize */}
          <div
            onClick={() => setMinimized(!minimized)}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] cursor-pointer"
          />

          {/* Fullscreen */}
          <div
            onClick={() => {
              setZoomed(!zoomed);
              setFullscreen(!zoomed);
            }}
            className="w-3 h-3 rounded-full bg-[#28c840] cursor-pointer"
          />

          <span className="text-sm font-medium text-black">
            Daiwiik&apos;s Mac
          </span>
        </div>
      </div>

      {/* Content */}
      {!minimized && (
        <div className="w-full h-[calc(100%-40px)] overflow-hidden">
          <div className="w-full h-full overflow-auto">
            <TerminalDemo onClose={onClose} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TerminalPopup;
