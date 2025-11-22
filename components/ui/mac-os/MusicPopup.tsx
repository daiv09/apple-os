"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useFullscreen } from "@/app/FullscreenContext";

interface MusicPopupProps {
  onClose: () => void;
}

const MusicPopup = ({ onClose }: MusicPopupProps) => {
  const { navbarVisible, setFullscreen, setNavbarVisible, setDockVisible } =
    useFullscreen();

  // Window states
  const [zoomed, setZoomed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        fixed z-[9999] bg-white border border-neutral-300 shadow-2xl 
        overflow-hidden backdrop-blur-xl transition-all duration-300

        ${
          zoomed
            ? `
          left-0 w-screen h-screen rounded-none
          ${navbarVisible ? "top-[40px]" : "top-0"}
        `
            : minimized
              ? "top-1/2 left-1/2 w-[200px] h-[40px] -translate-x-1/2 -translate-y-1/2 rounded-xl"
              : "top-10 right-10 w-[1000px] h-[650px] rounded-2xl"
        }
      `}
    >
      {/* Titlebar */}
      <div className="h-10 bg-[#ececec] border-b border-neutral-300 flex items-center px-4">
        <div className="flex gap-2">
          {/* CLOSE */}
          <div
            onClick={() => {
              if (zoomed) {
                // exiting fullscreen → restore UI
                setFullscreen(false);
                setNavbarVisible(true);
                setDockVisible(true);
              }
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-[#ff605c] cursor-pointer"
          />

          {/* MINIMIZE */}
          <div
            onClick={() => setMinimized(!minimized)}
            className="w-3 h-3 rounded-full bg-[#ffbd44] cursor-pointer"
          />

          {/* FULLSCREEN */}
          <div
            onClick={() => {
              setZoomed(!zoomed);
              setFullscreen(!zoomed);
            }}
            className="w-3 h-3 rounded-full bg-[#00ca4e] cursor-pointer"
          />
        </div>
      </div>

      {/* CONTENT — hidden when minimized */}
      {!minimized && (
        <>
          {/* Main layout */}
          <div className="flex h-full">
            {/* LEFT SIDEBAR */}
            <div className="w-64 bg-[#f6f6f6] border-r border-neutral-300 flex flex-col p-4">
              {/* Search */}
              <div className="flex items-center bg-white rounded-xl px-3 py-2 mb-4 border border-neutral-300">
                🔍
                <input
                  placeholder="Search"
                  className="ml-2 bg-transparent outline-none text-sm"
                />
              </div>

              {/* Nav Sections */}
              <SidebarHeading title="" />
              <SidebarItem selected icon="🏠" label="Home" />
              <SidebarItem icon="📻" label="Radio" />

              <SidebarHeading title="Library" />
              <SidebarItem icon="🕘" label="Recently Added" />
              <SidebarItem icon="🎤" label="Artists" />
              <SidebarItem icon="💽" label="Albums" />
              <SidebarItem icon="🎵" label="Songs" />

              <SidebarHeading title="Store" />
              <SidebarItem icon="🛍️" label="iTunes Store" />

              <SidebarHeading title="Playlists" />
              <SidebarItem icon="🔲" label="All Playlists" />

              {/* User Profile Bubble */}
              <div className="mt-auto pt-4">
                <div className="flex items-center gap-3 px-2 py-2 hover:bg-neutral-200 rounded-xl cursor-pointer">
                  <div className="w-8 h-8 bg-blue-600 rounded-full text-white text-center leading-8 font-semibold">
                    D
                  </div>
                  <span className="text-sm font-medium">Daiwiik</span>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto bg-white">
              <h1 className="text-4xl font-bold px-8 pt-6 pb-4">Home</h1>

              <div className="px-8 pb-24">
                {/* Big Apple Music banner */}
                <img
                  src="/apple-music.jpg"
                  className="w-full h-56 object-cover rounded-2xl shadow"
                />

                {/* Secondary banner */}
                <img
                  src="/music-banner.jpg"
                  className="w-full h-44 object-cover rounded-2xl shadow mt-6"
                />
              </div>
            </div>
          </div>

          {/* BOTTOM MUSIC PLAYER BAR */}
          <div
            className="
            absolute bottom-0 left-0 right-0 
            h-16 bg-[#1b1b1b] text-white 
            flex items-center justify-between 
            px-6 rounded-b-2xl shadow-inner
          "
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neutral-700 rounded-md"></div>
              <div>
                <div className="text-sm font-semibold">Dreamscape</div>
                <div className="text-xs opacity-70">Synthwave Artist</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 text-xl">
              <button>🔀</button>
              <button>⏮</button>
              <button className="text-3xl">▶️</button>
              <button>⏭</button>
              <button>🔁</button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3">
              🔊
              <div className="w-24 bg-neutral-600 h-1 rounded-full">
                <div className="w-12 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

/* Sidebar Components */
const SidebarItem = ({
  label,
  icon,
  selected = false,
}: {
  label: string;
  icon: string;
  selected?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg cursor-pointer
      ${selected ? "bg-red-500 text-white" : "hover:bg-neutral-200"}
    `}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </div>
);

const SidebarHeading = ({ title }: { title: string }) => (
  <div className="text-[11px] uppercase tracking-wide text-neutral-500 px-3 mt-4 mb-1">
    {title}
  </div>
);

export default MusicPopup;
