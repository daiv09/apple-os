"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useFullscreen } from "@/app/FullscreenContext";

interface PhotosPopupProps {
  onClose: () => void;
}

const PhotosPopup = ({ onClose }: PhotosPopupProps) => {
  const { navbarVisible, setFullscreen, setNavbarVisible, setDockVisible } =
    useFullscreen();

  // macOS window states
  const [zoomed, setZoomed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        fixed z-[9999] shadow-2xl bg-white border border-neutral-300 
        overflow-hidden backdrop-blur-xl transition-all duration-300

        ${
          zoomed
            ? `
          left-0 w-screen h-screen rounded-none
          ${navbarVisible ? "top-[40px]" : "top-0"}
        `
            : minimized
              ? "top-1/2 left-1/2 w-[200px] h-[40px] -translate-x-1/2 -translate-y-1/2 rounded-xl"
              : "top-12 right-10 w-[1050px] h-[650px] rounded-2xl"
        }
      `}
    >
      {/* macOS Titlebar */}
      <div className="h-10 bg-[#ececec] border-b border-neutral-300 flex items-center px-4">
        <div className="flex gap-2">
          {/* CLOSE */}
          <div
            onClick={() => {
              if (zoomed) {
                setFullscreen(false);
                setNavbarVisible(true);
                setDockVisible(true);
              }
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-[#ff605c] cursor-pointer"
          ></div>

          {/* MINIMIZE */}
          <div
            onClick={() => setMinimized(!minimized)}
            className="w-3 h-3 rounded-full bg-[#ffbd44] cursor-pointer"
          />

          {/* FULLSCREEN */}
          <div
            onClick={() => {
              setZoomed(!zoomed);
              setFullscreen(!zoomed); // Tell system UI that we’re fullscreen
            }}
            className="w-3 h-3 rounded-full bg-[#00ca4e] cursor-pointer"
          />
        </div>
      </div>

      {/* WHEN minimized -> hide content */}
      {!minimized && (
        <div className="flex h-full">
          {/* LEFT SIDEBAR */}
          <div className="w-64 bg-[#f6f6f6] border-r border-neutral-300 flex flex-col py-4">
            <SidebarSection title="Library" />
            <SidebarItem icon="📚" label="Library" />
            <SidebarItem icon="🖼️" label="Collections" />

            <SidebarSection title="Pinned" />
            <SidebarItem icon="❤️" label="Favourites" />
            <SidebarItem icon="⬇️" label="Recently Saved" selected />
            <SidebarItem icon="🗺️" label="Map" />
            <SidebarItem icon="🎬" label="Videos" />
            <SidebarItem icon="📱" label="Screenshots" />
            <SidebarItem icon="👥" label="People & Pets" />
            <SidebarItem icon="🗑️" label="Recently Deleted" locked />

            <SidebarSection title="Sharing" />
            <SidebarItem icon="👨‍👩‍👦" label="Shared Albums" />
            <SidebarItem icon="⏳" label="Activity" />

            <SidebarSection title="Utilities" />
            <SidebarItem icon="⚙️" label="Settings" />

            <div className="flex-1" />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-200">
              <h2 className="text-xl font-semibold">Recently Saved</h2>

              <div className="flex items-center gap-4">
                <ToolbarButton icon="➕" />
                <ToolbarButton icon="⬆️" />
                <ToolbarButton icon="☁️" />
                <ToolbarButton icon="⋯" />
                <ToolbarButton icon="◻️" />

                <div className="flex items-center bg-[#f5f5f7] rounded-xl px-3 py-1 w-48">
                  🔍
                  <input
                    placeholder="Search"
                    className="ml-2 bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="inline-block border-4 rounded-xl p-2 shadow-lg">
                <img
                  src="/Photo.jpeg"
                  className="w-60 h-auto rounded-lg shadow"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* --------------------------------------------- */
/* SIDEBAR COMPONENTS */
/* --------------------------------------------- */

const SidebarItem = ({
  label,
  icon,
  selected = false,
  locked = false,
}: {
  label: string;
  icon: string;
  selected?: boolean;
  locked?: boolean;
}) => (
  <div
    className={`
      flex items-center justify-between
      px-4 py-2 cursor-pointer text-sm 
      rounded-lg mx-2
      ${
        selected
          ? "bg-blue-100 text-blue-600 font-medium"
          : "hover:bg-neutral-200"
      }
    `}
  >
    <div className="flex items-center gap-3">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
    {locked && <span className="text-neutral-500">🔒</span>}
  </div>
);

const SidebarSection = ({ title }: { title: string }) => (
  <div className="text-[11px] uppercase tracking-wide text-neutral-500 px-4 mt-4 mb-1">
    {title}
  </div>
);

/* --------------------------------------------- */
/* TOOLBAR BUTTON */
/* --------------------------------------------- */

const ToolbarButton = ({ icon }: { icon: string }) => (
  <button className="p-2 rounded-xl hover:bg-neutral-200 text-lg">
    {icon}
  </button>
);

export default PhotosPopup;
