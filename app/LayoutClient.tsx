// app/LayoutClient.tsx
"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, AlertTriangle, ChevronRight, MessageSquare } from 'lucide-react';

interface LayoutClientProps {
  children: React.ReactNode;
  // isMobile prop is retained but primarily used for initial rendering
  isMobile: boolean; 
}

/**
 * 💻 MobileWarning Component (Apple Style)
 * A clean, monochromatic overlay compelling the user to switch devices.
 */
const MobileWarning = () => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '...';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col items-center justify-center p-4 antialiased"
    >
      <div className="flex flex-col items-center justify-center max-w-lg w-full">
        {/* Main Icon and Title */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="p-5 rounded-full mb-6"
        >
          {/* <Laptop className="w-16 h-16 text-neutral-800" strokeWidth={1.5} /> */}
          <Image src="https://cdn.jim-nielsen.com/macos/1024/safari-2021-06-02.png?rf=1024" alt="Laptop Icon" width={80} height={80} />
        </motion.div>

        <h1 className="text-3xl font-sf-pro-display font-semibold text-center mb-3">
          Designed for Desktop
        </h1>

        <p className="text-base text-neutral-500 text-center mb-8 leading-relaxed">
          This portfolio is a desktop experience, optimized for wider screens to deliver the full interactive UI. Please switch to your laptop or a device with a minimum 1024px width.
        </p>
        
        {/* Report Problem Button (Small and Minimal) */}
        <motion.a
          href="mailto:daiwiikharihar17147@gmail.com?subject=Mobile%20Warning%20Report"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center space-x-2 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          whileHover={{ y: -1 }}
        >
          <MessageSquare className="w-3 h-3" />
          <span>Report an issue</span>
        </motion.a>

        {/* Minimal Footer Warning */}
        <div className="mt-12 pt-6 border-t border-neutral-200 w-full flex items-center justify-center space-x-2 text-xs text-neutral-400">
          <AlertTriangle className="w-3 h-3" />
          <span>Viewing experience may be incomplete on this device.</span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * 🖥️ LayoutClient Component
 * Handles the logic for device detection and display switching.
 */
export function LayoutClient({ children, isMobile }: LayoutClientProps) {
  const [isClient, setIsClient] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(isMobile);
  const MIN_WIDTH = 1024; // Standard breakpoint for desktop

  useEffect(() => {
    // 1. Mark component as mounted (client-side)
    setIsClient(true);
    
    // 2. Client-side width check (most accurate source)
    const checkWidth = () => {
      // Use the actual window width for the most reliable decision
      setShowMobileWarning(window.innerWidth < MIN_WIDTH);
    };
    
    // Initial check and setup resize listener
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // 3. Hydration Prevention & Initial Server Render
  // On the first render (before useEffect runs), use the server-detected 'isMobile' state.
  // This prevents a hydration mismatch error by rendering the same component tree server- and client-side initially.
  if (!isClient) {
    return showMobileWarning ? <MobileWarning /> : children;
  }

  // 4. Client-side render with animation
  return (
    <AnimatePresence mode="wait">
      {showMobileWarning ? (
        <MobileWarning key="mobile-warning" />
      ) : (
        // Apply a clean fade-in transition when switching to desktop view
        <motion.div
          key="desktop-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full min-h-screen" // Ensure desktop content fills the screen
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}