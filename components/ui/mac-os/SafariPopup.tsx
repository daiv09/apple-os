"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useFullscreen } from "@/app/FullscreenContext";


interface SafariPopupProps {
  onClose: () => void;
}

interface TabData {
  id: string;
  title: string;
  url: string;
  iframeUrl: string;
  history: string[];
  historyIndex: number;
}

const SafariPopup = ({ onClose }: SafariPopupProps) => {
  const { navbarVisible, setFullscreen, setNavbarVisible, setDockVisible } =
    useFullscreen();
  /*
  ─────────────────────────────────────
  TAB STATE
  ─────────────────────────────────────
  */
 const [tabs, setTabs] = useState<TabData[]>([
   {
     id: crypto.randomUUID(),
     title: "New Tab",
     url: "www.ted.com/about/programs-initiatives/tedx-program",
     iframeUrl: "https://www.ted.com/about/programs-initiatives/tedx-program",
     history: ["https://www.ted.com/about/programs-initiatives/tedx-program"],
     historyIndex: 0,
    },
  ]);
  
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  
  const activeTab = tabs.find((t) => t.id === activeTabId)!;
  
  const normalizeUrl = (input: string) => {
    if (!input) return "";
    if (input.startsWith("http://") || input.startsWith("https://"))
      return input;
    return `https://${input}`;
  };

  /*
  ─────────────────────────────────────
  TAB ACTIONS
  ─────────────────────────────────────
  */
  const createNewTab = () => {
    const id = crypto.randomUUID();
    const newTab: TabData = {
      id,
      title: "New Tab",
      url: "google.com",
      iframeUrl: "https://google.com",
      history: ["https://google.com"],
      historyIndex: 0,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) return; // can't close last tab
    const index = tabs.findIndex((t) => t.id === id);

    const newTabs = tabs.filter((t) => t.id !== id);

    // Determine next active tab
    if (id === activeTabId) {
      const nextTab = newTabs[index - 1] || newTabs[index] || newTabs[0];
      setActiveTabId(nextTab.id);
    }

    setTabs(newTabs);
  };

  const switchTab = (id: string) => {
    setActiveTabId(id);
  };

  /*
  ─────────────────────────────────────
  NAVIGATION
  ─────────────────────────────────────
  */
  const handleSearch = () => {
    const fullUrl = normalizeUrl(activeTab.url);
    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTabId
        ? {
            ...tab,
            iframeUrl: fullUrl,
            history: [...tab.history, fullUrl],
            historyIndex: tab.history.length,
            title: fullUrl,
          }
        : tab
    );

    setTabs(updatedTabs);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  const handleBack = () => {
    const t = activeTab;
    if (t.historyIndex <= 0) return;

    const newIndex = t.historyIndex - 1;
    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTabId
        ? {
            ...tab,
            historyIndex: newIndex,
            iframeUrl: t.history[newIndex],
            title: t.history[newIndex],
          }
        : tab
    );

    setTabs(updatedTabs);
  };

  const handleForward = () => {
    const t = activeTab;
    if (t.historyIndex >= t.history.length - 1) return;

    const newIndex = t.historyIndex + 1;
    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTabId
        ? {
            ...tab,
            historyIndex: newIndex,
            iframeUrl: t.history[newIndex],
            title: t.history[newIndex],
          }
        : tab
    );

    setTabs(updatedTabs);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    const refreshedUrl = activeTab.iframeUrl + "?refresh=" + Date.now();

    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTabId ? { ...tab, iframeUrl: refreshedUrl } : tab
    );

    setTabs(updatedTabs);
    setTimeout(() => setIsLoading(false), 700);
  };

  /*
  ─────────────────────────────────────
  SAFARI TAB STRIP CSS
  ─────────────────────────────────────
  */
  const tabBarStyles = `
    .safari-tab-bar {
      display: flex;
      align-items: center;
      height: 38px;
      background: #F5F5F7;
      padding: 0 10px;
      border-bottom: 1px solid #D1D1D1;
    }
    .safari-tab {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      background: #E7E7E7;
      margin-right: 6px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      user-select: none;
      transition: 0.15s ease;
    }
    .safari-tab.active {
      background: #FFFFFF;
      border-top: 2px solid #B6B6B6;
    }
    .safari-tab-close {
      margin-left: 8px;
      font-size: 13px;
      cursor: pointer;
      opacity: 0.6;
    }
    .safari-tab-close:hover {
      opacity: 1;
    }
    .new-tab-button {
      font-size: 20px;
      cursor: pointer;
      background: none;
      border: none;
      margin-left: 4px;
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
  fixed z-[9999] bg-[#E5E5E5] dark:bg-[#262626] shadow-2xl overflow-hidden
  transition-all duration-300

  ${
    zoomed
      ? `
    left-0 w-screen h-screen translate-x-0 translate-y-0 rounded-none
    ${navbarVisible ? "top-[40px]" : "top-0"}
  `
      : minimized
        ? "top-1/2 left-1/2 w-[200px] h-[40px] -translate-x-1/2 -translate-y-1/2 rounded-[12px]"
        : "top-1/2 left-1/2 w-[90vw] max-w-[1000px] h-[85vh] max-h-[650px] -translate-x-1/2 -translate-y-1/2 rounded-[12px]"
  }
`}
    >
      {/* Inject Safari Tab CSS */}
      <style>{tabBarStyles}</style>

      {/* TITLE BAR (Existing) */}
      <div className="relative h-[52px] bg-[#E5E5E5] dark:bg-[#2B2B2B] border-b border-[#D1D1D1] dark:border-[#404040]">
        {/* Traffic Lights */}
        <div className="absolute top-[20px] left-[20px] flex gap-2 z-50">
          <button
            onClick={() => {
              if (zoomed) {
                setFullscreen(false);
                setNavbarVisible(true);
                setDockVisible(true);
              }
              onClose();
            }}
            className="h-3 w-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-all group relative"
          >
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-black/60">
              ✕
            </span>
          </button>

          <button
            onClick={() => setMinimized(!minimized)}
            className="h-3 w-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 transition-all group relative"
          >
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-black/60">
              −
            </span>
          </button>

          <button
            onClick={() => {
              setZoomed(!zoomed);
              setFullscreen(!zoomed); // <-- inform navbar
            }}
            className="h-3 w-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 transition-all group relative"
          >
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-black/60">
              ⤢
            </span>
          </button>
        </div>

        {/* Navigation + URL Bar (Your unchanged code) */}
        {/* ——————————————————————— */}
        {/* LEFT SIDE BUTTONS */}
        <div className="absolute top-[11px] left-[100px] flex gap-2">
          <button
            onClick={handleBack}
            className="w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-[#666] dark:text-[#A3A3A3]"
            >
              <path
                d="M7.5 2L3.5 6L7.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={handleForward}
            className="w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-[#666] dark:text-[#A3A3A3]"
            >
              <path
                d="M4.5 2L8.5 6L4.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* URL Bar */}
        <div className="absolute top-[11px] left-[180px] right-[180px] flex items-center gap-2">
          <div className="flex-1 h-[30px] flex items-center gap-2 px-3 rounded-md bg-white dark:bg-[#404040] border border-[#D1D1D1] dark:border-[#555] shadow-sm">
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              className="text-[#666] dark:text-[#A3A3A3]"
            >
              <path
                d="M3 5V4C3 2.34315 4.34315 1 6 1C7.65685 1 9 2.34315 9 4V5M2 7C2 6.44772 2.44772 6 3 6H9C9.55228 6 10 6.44772 10 7V12C10 12.5523 9.55228 13 9 13H3C2.44772 13 2 12.5523 2 12V7Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>

            <input
              value={activeTab.url}
              onChange={(e) => {
                const updatedTabs = tabs.map((t) =>
                  t.id === activeTabId ? { ...t, url: e.target.value } : t
                );
                setTabs(updatedTabs);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent text-[13px] text-black dark:text-white outline-none"
              placeholder="Search or enter website name"
            />

            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#666] border-t-transparent rounded-full animate-spin" />
            ) : (
              <button
                onClick={handleRefresh}
                className="w-5 h-5 hover:bg-black/5 dark:hover:bg-white/10 rounded flex items-center justify-center"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-[#666] dark:text-[#A3A3A3]"
                >
                  <path
                    d="M1.5 7C1.5 4.23858 3.73858 2 6.5 2C8.18909 2 9.68909 2.81818 10.5 4.09091M12.5 7C12.5 9.76142 10.2614 12 7.5 12C5.81091 12 4.31091 11.1818 3.5 9.90909M10.5 4.09091V1M10.5 4.09091H13.5M3.5 9.90909H0.5M3.5 9.90909V13"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right Icons (unchanged) */}
        <div className="absolute top-[11px] right-[20px] flex gap-2">
          <button className="w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-[#666] dark:text-[#A3A3A3]"
            >
              <path
                d="M7 1V9M7 1L4 3.5M7 1L10 3.5M2 7V11C2 12.1046 2.89543 13 4 13H10C11.1046 13 12 12.1046 12 11V7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg:white/10 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[#666] dark:text-[#A3A3A3]"
            >
              <rect
                x="2"
                y="3"
                width="12"
                height="10"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path d="M2 5.5H14" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>

          <button
            onClick={createNewTab}
            className="w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg:white/10 flex items-center justify-center"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-[#666] dark:text-[#A3A3A3]"
            >
              <path
                d="M7 2V12M2 7H12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* SAFARI TAB STRIP */}
      {!minimized && (
        <div className="safari-tab-bar">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`safari-tab ${tab.id === activeTabId ? "active" : ""}`}
              onClick={() => switchTab(tab.id)}
            >
              {tab.title.length > 20 ? tab.title.slice(0, 20) + "…" : tab.title}

              {tabs.length > 1 && (
                <span
                  className="safari-tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  ×
                </span>
              )}
            </div>
          ))}

          {/* NEW TAB BUTTON */}
          <button className="new-tab-button" onClick={createNewTab}>
            +
          </button>
        </div>
      )}

      {/* IFREAME CONTENT */}
      {!minimized && (
        <div className="w-full h-[calc(100%-90px)] bg-white dark:bg-[#1a1a1a] relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Loading...
                </p>
              </div>
            </div>
          )}

          <iframe
            src={activeTab.iframeUrl}
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Safari Browser"
          />
        </div>
      )}
    </motion.div>
  );
};

export default SafariPopup;
