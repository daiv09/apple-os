"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useFullscreen } from "@/app/FullscreenContext";

interface MailPopupProps {
  onClose: () => void;
}

interface Message {
  id: number;
  from: string;
  subject: string;
  date: string;
  preview: string;
  body: string;
}

const MailApp = ({ onClose }: MailPopupProps) => {
  // 🔥 Fullscreen context
  const { navbarVisible, setFullscreen, setNavbarVisible, setDockVisible } =
    useFullscreen();

  // 🔥 App window states
  const [zoomed, setZoomed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // 🔥 Mail states
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState({ subject: "", body: "" });

  const sendEmail = async () => {
    if (!draft.subject.trim() && !draft.body.trim()) {
      alert("Please enter a subject or message");
      return;
    }

    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: draft.subject,
          body: draft.body,
          to: "daiwiikharihar17147@gmail.com",
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      alert("Email sent successfully! ✓");
      setComposeOpen(false);
      setDraft({ subject: "", body: "" });
    } catch (error) {
      alert(`Failed to send email: ${(error as Error).message}`);
    }
  };

  const inbox = [
    {
      id: 1,
      from: "iCloud",
      subject: "Welcome to iCloud Mail",
      date: "05/08/25",
      preview:
        "Welcome to iCloud Mail, Daiwiik! Your email address is daiwiikharihar@icloud.com.",
      body: "Welcome to iCloud Mail, Daiwiik! Your email address is daiwiikharihar@icloud.com.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        fixed z-[9999] bg-white border border-neutral-300 shadow-2xl overflow-hidden rounded-2xl
        transition-all duration-300 backdrop-blur-xl

        ${
          zoomed
            ? `
            w-screen h-screen left-0 translate-x-0 translate-y-0 rounded-none
            ${navbarVisible ? "top-[40px]" : "top-0"}
          `
            : minimized
              ? "top-1/2 left-1/2 w-[250px] h-[40px] -translate-x-1/2 -translate-y-1/2 rounded-xl"
              : "top-12 right-10 w-[1050px] h-[650px]"
        }
      `}
    >
      {/* macOS Titlebar */}
      <div className="h-10 bg-[#ececec] border-b border-neutral-300 flex items-center px-4 relative">
        <div className="flex gap-2">
          {/* ⭐ FIXED CLOSE BUTTON */}
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
          />

          {/* Minimize */}
          <div
            onClick={() => setMinimized(!minimized)}
            className="w-3 h-3 rounded-full bg-[#ffbd44] cursor-pointer"
          />

          {/* Maximize / Fullscreen */}
          <div
            onClick={() => {
              setZoomed(!zoomed);
              setFullscreen(!zoomed);
            }}
            className="w-3 h-3 rounded-full bg-[#00ca4e] cursor-pointer"
          />
        </div>
      </div>

      {!minimized && (
        <div className="flex w-full h-full bg-white border overflow-hidden">
          {/* LEFT SIDEBAR */}
          <div className="w-56 border-r p-3 text-sm">
            <h1 className="text-lg font-semibold mb-4">Favourites</h1>
            <div className="space-y-2">
              <div className="font-medium">Inbox</div>
              <div className="text-gray-500">Sent</div>
            </div>
          </div>

          {/* MESSAGE LIST */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="font-semibold">Inbox</div>
            </div>

            <div className="overflow-auto">
              {inbox.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-3 cursor-pointer border-b hover:bg-gray-100 ${
                    selectedMessage?.id === msg.id ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="font-semibold">{msg.from}</div>
                  <div className="text-xs text-gray-500">{msg.subject}</div>
                  <div className="text-xs text-gray-400">{msg.preview}</div>
                </div>
              ))}
            </div>

            <button
              className="m-3 bg-blue-500 text-white py-2 rounded-lg"
              onClick={() => setComposeOpen(true)}
            >
              Compose
            </button>
          </div>

          {/* MESSAGE VIEWER */}
          <div className="flex-1 p-6 overflow-auto text-sm text-gray-700">
            {selectedMessage ? (
              <div>
                <h1 className="text-xl font-semibold mb-2">
                  {selectedMessage.subject}
                </h1>
                <p className="mb-4 text-gray-500">{selectedMessage.date}</p>
                <p>{selectedMessage.body}</p>
              </div>
            ) : (
              <div className="text-gray-400 text-center mt-20 text-lg">
                No Message Selected
              </div>
            )}
          </div>

          {/* COMPOSE POPUP */}
          {composeOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-10 left-1/2 -translate-x-1/2 bg-white shadow-xl border w-[500px] rounded-xl p-4"
            >
              <h2 className="text-lg font-semibold mb-4">New Message</h2>

              <input
                value="daiwiikharihar17147@gmail.com"
                disabled
                className="w-full border px-3 py-2 rounded mb-2 text-sm bg-gray-100 pointer-events-none"
              />

              <input
                value={draft.subject}
                onChange={(e) =>
                  setDraft({ ...draft, subject: e.target.value })
                }
                placeholder="Subject"
                className="w-full border px-3 py-2 rounded mb-2 text-sm"
              />

              <textarea
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                placeholder="Message..."
                className="w-full border px-3 py-2 rounded h-40 text-sm"
              />

              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => setComposeOpen(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={sendEmail}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MailApp;
