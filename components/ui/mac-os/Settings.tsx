"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Bell, Monitor, Wallpaper, Lock, Search 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TYPES ---
type SettingSection = "Appearance" | "Notifications" | "Displays" | "Wallpaper" | "Lock Screen";

interface SettingsProps {
  onClose: () => void;
  isStaticBackgroundActive: boolean;
  setIsStaticBackgroundActive: (val: boolean) => void;
}

export default function SystemSettings({ 
  onClose, 
  isStaticBackgroundActive, 
  setIsStaticBackgroundActive 
}: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingSection>("Displays");
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarItems = [
    { id: "Appearance", icon: <Settings size={16} />, color: "bg-gray-500" },
    { id: "Notifications", icon: <Bell size={16} />, color: "bg-red-500" },
    { id: "Displays", icon: <Monitor size={16} />, color: "bg-blue-500" },
    { id: "Wallpaper", icon: <Wallpaper size={16} />, color: "bg-cyan-500" },
    { id: "Lock Screen", icon: <Lock size={16} />, color: "bg-gray-700" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-[850px] h-[600px] bg-[#ECECEC]/90 backdrop-blur-2xl rounded-xl shadow-2xl flex overflow-hidden border border-white/20 select-none text-black"
    >
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-gray-300/50 flex flex-col pt-4">
        {/* Traffic Lights */}
        <div className="flex gap-2 px-5 mb-6">
          <button onClick={onClose} className="w-3 h-3 bg-[#FF5F56] rounded-full shadow-inner" />
          <div className="w-3 h-3 bg-[#FFBD2E] rounded-full shadow-inner" />
          <div className="w-3 h-3 bg-[#27C93F] rounded-full shadow-inner" />
        </div>

        {/* Search */}
        <div className="px-4 mb-4 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
          <input 
            type="text" 
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-300/50 border border-gray-400/20 rounded-md py-1 pl-7 pr-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as SettingSection)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] transition-colors",
                activeSection === item.id ? "bg-blue-500 text-white" : "hover:bg-gray-300/50"
              )}
            >
              <div className={cn("p-1 rounded-md text-white shadow-sm", item.color)}>
                {item.icon}
              </div>
              <span className="font-medium">{item.id}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 bg-white/50 overflow-y-auto p-8 relative">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">{activeSection}</h1>
        </header>

        <AnimatePresence mode="wait">
          {activeSection === "Displays" && (
            <motion.div
              key="displays"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Display Arrangement Mockup */}
              <div className="bg-gray-200/50 rounded-lg p-6 flex justify-center items-end gap-4 border border-gray-300">
                <div className="w-32 h-20 bg-black rounded-sm border-2 border-blue-500 shadow-lg relative">
                  <span className="absolute bottom-1 left-1 text-[8px] text-white/50">Built-in Display</span>
                </div>
                <div className="w-24 h-16 bg-black rounded-sm border-2 border-gray-600 shadow-md" />
              </div>

              {/* Resolution Settings Card */}
              <div className="bg-white/80 rounded-xl border border-gray-300 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="text-sm font-semibold">Resolution</span>
                  <span className="text-xs text-gray-500">1080p (Default)</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Refresh Rate</span>
                    <select className="bg-gray-100 border rounded px-2 py-0.5 text-xs">
                      <option>60 Hertz</option>
                      <option>120 Hertz ProMotion</option>
                    </select>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-sm">
                    <span>Rotation</span>
                    <select className="bg-gray-100 border rounded px-2 py-0.5 text-xs font-bold text-blue-600">
                      <option>Standard</option>
                      <option selected>90°</option>
                      <option>180°</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "Wallpaper" && (
            <motion.div key="wallpaper" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsStaticBackgroundActive(false)}
                  className={cn("p-2 rounded-lg border-2 transition-all", !isStaticBackgroundActive ? "border-blue-500 bg-blue-50" : "border-transparent bg-gray-200")}
                >
                  <div className="aspect-video bg-blue-400 rounded-md mb-2 shadow-inner" />
                  <span className="text-xs font-bold">Video Loop</span>
                </button>
                <button 
                  onClick={() => setIsStaticBackgroundActive(true)}
                  className={cn("p-2 rounded-lg border-2 transition-all", isStaticBackgroundActive ? "border-blue-500 bg-blue-50" : "border-transparent bg-gray-200")}
                >
                  <div className="aspect-video bg-cyan-600 rounded-md mb-2 shadow-inner" />
                  <span className="text-xs font-bold">Static Sonoma</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}