"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface CalculatorPopupProps {
  onClose: () => void;
}

const CalculatorPopup = ({ onClose }: CalculatorPopupProps) => {
  const [input, setInput] = useState("0");
  const [minimized, setMinimized] = useState(false);
  const [zoomed, setZoomed] = useState(false);

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

  const customHandleClick = (value: string) => {
    // AC - Clear all
    if (value === "AC") return setInput("0");

    // X - Backspace/Undo (delete last character)
    if (value === "X") {
      setInput((prev) => {
        if (prev.length === 1) return "0";
        return prev.slice(0, -1);
      });
      return;
    }

    // +/- Toggle negative/positive
    if (value === "+/-") {
      if (input === "0") return;
      return setInput(String(parseFloat(input) * -1));
    }

    // = Calculate result
    if (value === "=") {
      try {
        const safeInput = input
          .replace(/÷/g, "/")
          .replace(/×/g, "*")
          .replace(/--/g, "+");

        const result = Function(`return ${safeInput}`)();
        return setInput(String(result));
      } catch {
        return setInput("Error");
      }
    }

    // Append input
    setInput((prev) => {
      if (prev === "0" && value !== ".") return value;
      if (prev === "Error") return value;
      return prev + value;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: minimized ? 0.7 : 1,
        scale: zoomed ? 1.2 : minimized ? 0.7 : 1,
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
            : zoomed
              ? "w-[380px]"
              : "w-[300px]"
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

        {/* ZOOM */}
        <button
          className="h-3 w-3 rounded-full bg-gray-600 hover:brightness-110"
        />
      </div>

      {!minimized && (
        <>
          {/* Display */}
          <div className="px-6 pb-4 pt-8 text-right min-h-[100px] flex items-end justify-end">
            <div className="text-6xl font-extralight tracking-tight">
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
                  onClick={() => customHandleClick(btn.label)}
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
