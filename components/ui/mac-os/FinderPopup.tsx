"use client";

import React, { useState, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import {
  Folder,
  Search,
  ChevronLeft,
  ChevronRight,
  Grid,
  LayoutGrid,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import Image from "next/image";

import { useFullscreen } from "@/app/FullscreenContext";
import FileItem from "./FileItem";
import { FileItem as FileItemType } from "@/types/finder";
import { folderStructure } from "@/data/finderData";

export default function FinderPopup({ onClose }: { onClose: () => void }) {
  const { setFullscreen, navbarVisible, setNavbarVisible, setDockVisible } =
    useFullscreen();

  const [zoomed, setZoomed] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("Projects");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["Projects"]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const popupRef = useRef<HTMLDivElement | null>(null);
  const dragControls = useDragControls();

  const [sidebarOpen] = useState(true);

  // Get current items based on path
  const currentItems = folderStructure[currentPath] || [];

  // Filter items based on search
  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleZoom = () => {
    setZoomed(!zoomed);
    setFullscreen(!zoomed);
  };

  const handleMinimize = () => {
    setMinimized(true);
    setTimeout(() => setMinimized(false), 350);
  };

  const handleDoubleClick = (item: FileItemType) => {
    if (item.type === 'folder') {
      const newPath = item.name;
      if (folderStructure[newPath]) {
        // Add to navigation history
        const newHistory = navigationHistory.slice(0, historyIndex + 1);
        newHistory.push(newPath);
        setNavigationHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentPath(newPath);
        setSelectedItem(null);
      }
    } else {
      // Handle file opening
      alert(`Opening ${item.name}`);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(navigationHistory[historyIndex - 1]);
      setSelectedItem(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(navigationHistory[historyIndex + 1]);
      setSelectedItem(null);
    }
  };

  const handleSidebarClick = (location: string) => {
    if (folderStructure[location]) {
      const newHistory = navigationHistory.slice(0, historyIndex + 1);
      newHistory.push(location);
      setNavigationHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentPath(location);
      setSelectedItem(null);
    }
  };

  return (
    <motion.div
      ref={popupRef}
      drag={!zoomed && !minimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: minimized ? 0 : 1,
        x: zoomed ? 0 : undefined,
        y: minimized ? 300 : zoomed ? 0 : undefined,
        scale: zoomed ? 1 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`
        fixed z-[9999] bg-transparent shadow-2xl border border-[#D0D0D0] 
        rounded-xl overflow-hidden select-none transition-all duration-300

        ${zoomed
          ? `
              left-0 w-full h-full rounded-none
              ${navbarVisible ? "top-[40px]" : "top-0"}
            `
          : "top-[10%] left-[20%] w-[900px] h-[600px]"
        }

        ${minimized ? "opacity-0 translate-y-[300px]" : ""}
      `}
    >
      {/* Title Bar
      <div
        className="h-10 bg-white border-b border-gray-300 flex items-center px-4 cursor-default"
        onPointerDown={(e) => dragControls.start(e)}
      > */}


      {/* <div className="flex-1 text-center text-xs text-gray-500 pr-8 select-none">
          Finder
        </div> */}
      {/* </div> */}

      {/* Window Content */}
      <div className="w-full h-full bg-white flex overflow-hidden">
        {sidebarOpen && (
          <div className="w-64 bg-white border-r border-gray-300 p-4 pl-5 flex flex-col overflow-y-auto">

            {/* Traffic lights */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => {
                  if (zoomed) {
                    setFullscreen(false);
                    setNavbarVisible(true);
                    setDockVisible(true);
                  }
                  onClose();
                }}
                className="w-3 h-3 bg-[#FF5F56] rounded-full hover:brightness-90 transition"
              />
              <button
                onClick={handleMinimize}
                className="w-3 h-3 bg-[#FFBD2E] rounded-full hover:brightness-90 transition"
              />
              <button
                onClick={handleZoom}
                className="w-3 h-3 bg-[#27C93F] rounded-full hover:brightness-90 transition"
              />
            </div>

            {/* FAVOURITES */}
            <div className="text-[11px] font-semibold text-gray-500 tracking-wide mb-1.5">
              FAVOURITES
            </div>
            <div className="space-y-0.5 mb-3">
              {["Desktop", "Documents", "Photos"].map((item) => (
                <div
                  key={item}
                  onClick={() => handleSidebarClick(item)}
                  className={`px-2 py-1 rounded-md hover:bg-gray-200 cursor-pointer text-sm transition
            ${currentPath === item ? "bg-blue-100 text-blue-600" : ""}
          `}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* PROJECTS */}
            <div className="text-[11px] font-semibold text-gray-500 tracking-wide mb-1.5">
              PROJECTS
            </div>
            <div className="space-y-0.5 mb-3">
              <div
                onClick={() => handleSidebarClick("Projects")}
                className={`px-2 py-1 rounded-md hover:bg-gray-200 cursor-pointer text-sm flex items-center gap-2
          ${currentPath === "Projects" ? "bg-blue-100 text-blue-600" : ""}
        `}
              >
                <Image src="/folder.png" alt="folder icon" width={18} height={18} />
                Projects
              </div>
            </div>

            {/* LOCATIONS */}
            <div className="text-[11px] font-semibold text-gray-500 tracking-wide mb-1.5">
              LOCATIONS
            </div>
            <div className="space-y-0.5 mb-3">
              {["iCloud Drive", "sdc-user1", "AirDrop", "Network", "Bin"].map((item) => (
                <div
                  key={item}
                  className="px-2 py-1 rounded-md hover:bg-gray-200 cursor-pointer text-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* TAGS */}
            <div className="text-[11px] font-semibold text-gray-500 tracking-wide mb-1.5">
              TAGS
            </div>
            <div className="space-y-0.5">
              {[
                { name: "Red", color: "bg-red-500" },
                { name: "Orange", color: "bg-orange-500" },
                { name: "Yellow", color: "bg-yellow-500" },
                { name: "Green", color: "bg-green-500" },
              ].map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-200 cursor-pointer text-sm"
                >
                  <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                  {tag.name}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="w-full h-14 bg-white border-b border-gray-300 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                disabled={historyIndex === 0}
                className="p-1 hover:bg-gray-200 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleForward}
                disabled={historyIndex === navigationHistory.length - 1}
                className="p-1 hover:bg-gray-200 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
              <div className="font-semibold text-gray-800">{currentPath}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-200 rounded-lg px-2 py-1">
                <Search size={16} className="text-gray-600" />
                <input
                  className="bg-transparent outline-none text-sm px-2 w-32"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Grid
                size={18}
                onClick={() => setViewMode('grid')}
                className={`cursor-pointer transition ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-700 hover:text-black'
                  }`}
              />
              <LayoutGrid
                size={18}
                onClick={() => setViewMode('list')}
                className={`cursor-pointer transition ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-700 hover:text-black'
                  }`}
              />
              <Upload
                size={18}
                className="text-gray-700 cursor-pointer hover:text-black"
              />
              <MoreHorizontal
                size={18}
                className="text-gray-700 cursor-pointer hover:text-black"
              />
            </div>
          </div>

          {/* File Grid */}
          <div className="flex-1 p-6 overflow-auto bg-white">
            {filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                {searchQuery ? 'No items match your search' : 'This folder is empty'}
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-6' : 'grid-cols-1'}`}>
                {filteredItems.map((item) => (
                  <FileItem
                    key={item.id}
                    item={item}
                    onDoubleClick={handleDoubleClick}
                    isSelected={selectedItem === item.id}
                    onClick={() => setSelectedItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-8 bg-black border-t border-gray-300 flex items-center justify-between px-4 text-xs text-gray-500">
            <span>{filteredItems.length} items</span>
            <span>
              {filteredItems.filter(i => i.type === 'folder').length} folders, {filteredItems.filter(i => i.type === 'file').length} files
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
