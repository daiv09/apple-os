'use client';

import React, { useState } from "react";
import { motion } from "motion/react";

interface SafariPopupProps {
  onClose: () => void;
}

const SafariPopup = ({ onClose }: SafariPopupProps) => {
  const [url, setUrl] = useState("https://www.apple.com");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="
        fixed top-20 right-10 md:top-28 md:right-16
        z-[9999]
        w-[700px] h-[450px]
        rounded-xl shadow-2xl
        border border-border
        bg-background/90 backdrop-blur-lg
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border select-none">
        <div className="flex gap-2">
          <button className="h-3 w-3 rounded-full bg-red-500" onClick={onClose} />
          <button className="h-3 w-3 rounded-full bg-yellow-500" />
          <button className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="font-medium text-sm">Safari</span>
        <div className="w-3" /> {/* spacing */}
      </div>

      {/* URL Bar */}
      <div className="p-2 border-b border-border flex items-center gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-3 py-1 bg-muted/50 rounded-md text-sm outline-none"
        />
        <button
          onClick={() => setUrl(url)}
          className="px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground"
        >
          Go
        </button>
      </div>

      {/* Page View */}
      <iframe
        src={url}
        className="w-full h-full bg-white rounded-b-xl"
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </motion.div>
  );
};

export default SafariPopup;
