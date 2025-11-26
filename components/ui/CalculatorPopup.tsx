"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";

interface CalculatorPopupProps {
  onClose: () => void;
}

const CalculatorPopup = ({ onClose }: CalculatorPopupProps) => {
  const [input, setInput] = useState("0");
  const [minimized, setMinimized] = useState(false);
  // REMOVED: zoomed state

  const buttons = [
    { label: "X", type: "function" },
    { label: "AC", type: "function" },
    { label: "%", type: "function" },
    { label: "÷", type: "operator" },
    { label: "7", type: "number" },
    { label: "8", type: "number" },
    { label: "9", type: "number" },
    { label: "×", type: "operator" },
    { label: "4", type: "number" },
    { label: "5", type: "number" },
    { label: "6", type: "number" },
    { label: "-", type: "operator" },
    { label: "1", type: "number" },
    { label: "2", type: "number" },
    { label: "3", type: "number" },
    { label: "+", type: "operator" },
    { label: "+/-", type: "function" },
    { label: "0", type: "number" },
    { label: ".", type: "number" },
    { label: "=", type: "equal" },
  ];

  const processInput = useCallback((value: string) => {
    // AC - Clear all
    if (value === "AC") return setInput("0");

    // X - Backspace/Undo
    if (value === "X") {
      setInput((prev) => {
        if (prev === "Error") return "0";
        if (prev.length === 1) return "0";
        return prev.slice(0, -1);
      });
      return;
    }

    // +/- Toggle
    if (value === "+/-") {
      setInput((prev) => {
        if (prev === "0" || prev === "Error") return prev;
        return String(parseFloat(prev) * -1);
      });
      return;
    }

    // = Calculate
    if (value === "=") {
      setInput((prev) => {
        try {
          if (!prev || prev === "Error") return "0";
          
          const safeInput = prev
            .replace(/÷/g, "/")
            .replace(/×/g, "*")
            .replace(/--/g, "+");

          // eslint-disable-next-line no-new-func
          const result = Function(`return ${safeInput}`)();
          return String(result);
        } catch {
          return "Error";
        }
      });
      return;
    }

    // Standard Input
    setInput((prev) => {
      if (prev === "0" && value !== ".") return value;
      if (prev === "Error") return value;
      return prev + value;
    });
  }, []);

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (minimized) return;

      const key = e.key;

      if (['/', '*', '+', '-', 'Enter', 'Backspace', 'Escape'].includes(key)) {
        e.preventDefault();
      }

      if (/^[0-9.]$/.test(key)) {
        processInput(key);
      }
      else if (key === '+') processInput('+');
      else if (key === '-') processInput('-');
      else if (key === '*') processInput('×');
      else if (key === '/') processInput('÷');
      else if (key === '%') processInput('%');
      else if (key === 'Enter' || key === '=') processInput('=');
      else if (key === 'Backspace') processInput('X');
      else if (key === 'Escape' || key.toLowerCase() === 'c') processInput('AC');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processInput, minimized]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: minimized ? 0.7 : 1,
        scale: minimized ? 0.7 : 1, // Removed zoomed scale logic
      }}
      transition={{ duration: 0.25 }}
      className={`
        fixed top-20 right-10
        z-[9999] 
        bg-[#1C1C1E]
        rounded-3xl shadow-2xl
        border border-[#333]
        text-white
        transition-all
        ${
          minimized
            ? "w-[160px] h-[50px] overflow-hidden"
            : "w-[300px]" // Removed zoomed width logic
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-3 gap-2">
        {/* CLOSE */}
        <button
          className="h-3 w-3 rounded-full bg-[#FF5F57] hover:brightness-110"
          onClick={onClose}
        />

        {/* MINIMIZE */}
        <button
          className="h-3 w-3 rounded-full bg-[#FFBD2E] hover:brightness-110"
          onClick={() => setMinimized(!minimized)}
        />

        {/* ZOOM - Disabled/Visual only */}
        <div
          className="h-3 w-3 rounded-full bg-gray-600 hover:brightness-110"
          title="Zoom disabled"
        />
      </div>

      {!minimized && (
        <>
          {/* Display */}
          <div className="px-6 pb-4 pt-8 text-right min-h-[100px] flex items-end justify-end">
            <div className="text-6xl font-extralight tracking-tight break-all">
              {input}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3 p-4">
            {buttons.map((btn, idx) => {
              let base =
                "flex items-center justify-center rounded-full text-2xl font-light active:scale-95 transition h-14";

              if (btn.type === "number") base += " bg-[#505050] text-white";
              if (btn.type === "number-wide")
                base += " col-span-2 bg-[#505050] text-white h-14";
              if (btn.type === "function") base += " bg-[#D4D4D2] text-black";
              if (btn.type === "operator") base += " bg-[#FF9500] text-white";
              if (btn.type === "equal") base += " bg-[#FF9500] text-white";

              return (
                <button
                  key={idx}
                  className={base}
                  onClick={() => processInput(btn.label)}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CalculatorPopup;