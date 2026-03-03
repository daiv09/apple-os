"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LockScreenProps {
  onUnlock: () => void;
  isStaticBackgroundActive: boolean;
}

export default function LockScreen({
  onUnlock,
  isStaticBackgroundActive,
}: LockScreenProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }),
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      );
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setPassword("");
      }, 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-10000 flex flex-col items-center select-none overflow-hidden pt-20"
    >
      {/* 🛑 BACKGROUND SECTION (CLEAN) 🛑 */}
      <div className="absolute inset-0 z-[-1]">
        {isStaticBackgroundActive ? (
          <Image
            src="/background.jpg"
            alt="Sonoma Static"
            fill
            priority
            className="object-cover transition-opacity duration-1000"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-opacity duration-1000"
          >
            <source src="/compressed_video_background.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* TOP SECTION: Liquid Glass Date and Time */}
      <div className="flex flex-col items-center text-white text-center">
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-[22px] font-semibold tracking-tight mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
        >
          {date}
        </motion.span>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[140px] font-bold tracking-tighter leading-none drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        >
          {time}
        </motion.h1>
      </div>

      {/* 🛑 THE HUGE GAP (Arbitrary Spacer) 🛑 */}
      <div className="grow" />

      {/* BOTTOM SECTION: Small Profile & Liquid Glass Input */}
      <div className="flex flex-col items-center pb-24">
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="flex flex-col items-center"
        >
          {/* Very Small Profile Image */}
          <div className="w-12 h-12 rounded-full bg-white overflow-hidden mb-4 shadow-2xl relative">
            <Image
              src="/profile.png"
              alt="Admin"
              fill // 🛑 Use 'fill' to make it match the parent container exactly
              className="object-cover"
              priority
            />
          </div>

          <span className="text-white text-sm font-semibold mb-6 tracking-widest drop-shadow-md">
            DAIWIIK
          </span>

          {/* Liquid Glass Password Input */}
          <form onSubmit={handleUnlock} className="relative group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-44 bg-white/15 backdrop-blur-2xl text-white placeholder-white/40 border border-white/10 rounded-full px-4 py-1.5 text-[13px] outline-none focus:ring-1 focus:ring-white/30 transition-all text-center"
            />
            {/* Optional Arrow indicator */}
            {password.length > 0 && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    d="M5 12h14m-7-7 7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </form>

          <span className="mt-4 text-white/40 text-[11px] font-medium drop-shadow-sm">
            Your password is required to log in
          </span>
        </motion.div>
      </div>

      {/* Sleep/Restart/Shut Down Controls (Optional icons from image) */}
      <div className="absolute bottom-6 w-full flex justify-center items-center gap-8 opacity-60 scale-90">
        {/* Add logic for these icons if needed */}
      </div>
    </motion.div>
  );
}
