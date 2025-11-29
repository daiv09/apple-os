"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useFullscreen } from "@/app/FullscreenContext";

const NOTES_LIST_KEY = "notes_list";
const ACTIVE_NOTE_KEY = "active_note";

interface NotesPopupProps {
  onClose: () => void;
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

const NotesPopup = ({ onClose }: NotesPopupProps) => {
  const { navbarVisible, setFullscreen, setNavbarVisible, setDockVisible } =
    useFullscreen();

  // Window states
  const [zoomed, setZoomed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const stored = localStorage.getItem(NOTES_LIST_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [active, setActive] = useState<string | null>(() => {
    const listStored = localStorage.getItem(NOTES_LIST_KEY);
    const activeStored = localStorage.getItem(ACTIVE_NOTE_KEY);
    if (activeStored) return activeStored;
    const parsed = listStored ? JSON.parse(listStored) : [];
    return parsed[0]?.id || null;
  });

  useEffect(() => {
    localStorage.setItem(NOTES_LIST_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (active) localStorage.setItem(ACTIVE_NOTE_KEY, active);
  }, [active]);

  const activeNote = notes.find((n) => n.id === active);

  const createNewNote = () => {
    const id = crypto.randomUUID();
    const date = new Date().toLocaleString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newNote: NoteItem = {
      id,
      date,
      title: "New Note",
      content: "",
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    setActive(id);
  };

  const updateNote = (field: "title" | "content", value: string) => {
    if (!activeNote) return;
    const updated = notes.map((n) =>
      n.id === activeNote.id ? { ...n, [field]: value } : n
    );
    setNotes(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        fixed z-[9999] bg-[#f7f7f7] border border-neutral-300 shadow-xl
        overflow-hidden transition-all duration-300

        ${zoomed
          ? `
          left-0 w-screen h-screen rounded-none
          ${navbarVisible ? "top-[40px]" : "top-0"}
        `
          : minimized
            ? "top-1/2 left-1/2 w-[200px] h-[40px] -translate-x-1/2 -translate-y-1/2 rounded-xl"
            : "top-16 right-12 w-[800px] h-[500px] rounded-2xl"
        }
      `}
    >

      {/* Notes UI */}
      {!minimized && (
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-[#fafafa] border-r border-neutral-300 overflow-y-auto">

            {/* Traffic lights with spacing */}
            <div className="flex gap-2 p-4 pb-5">
              <div
                onClick={() => {
                  if (zoomed) {
                    setFullscreen(false);
                    setNavbarVisible(true);
                    setDockVisible(true);
                  }
                  onClose();
                }}
                className="w-3 h-3 bg-[#ff605c] rounded-full cursor-pointer"
              />

              <div
                onClick={() => setMinimized(!minimized)}
                className="w-3 h-3 bg-[#ffbd44] rounded-full cursor-pointer"
              />

              <div
                onClick={() => {
                  setZoomed(!zoomed);
                  setFullscreen(!zoomed);
                }}
                className="w-3 h-3 bg-[#00ca4e] rounded-full cursor-pointer"
              />
            </div>

            {/* Add spacing above New Note */}
            <div className="mb-3">
              <button
                onClick={createNewNote}
                className="w-full text-left px-4 py-3 border-b border-neutral-300 hover:bg-neutral-100 text-sm font-medium"
              >
                + New Note
              </button>
            </div>

            {/* Notes list with consistent spacing */}
            <div className="space-y-1">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActive(note.id)}
                  className={`px-4 py-3 cursor-pointer border-b border-neutral-200 ${active === note.id
                      ? "bg-yellow-100"
                      : "hover:bg-neutral-100"
                    }`}
                >
                  <div className="font-medium text-sm truncate">{note.title}</div>
                  <div className="text-xs text-neutral-500 truncate">
                    {note.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Editor Pane */}
          <div className="flex-1 flex flex-col bg-white">
            {activeNote ? (
              <>
                <input
                  value={activeNote.title}
                  onChange={(e) => updateNote("title", e.target.value)}
                  className="w-full px-4 py-3 text-xl font-semibold outline-none bg-transparent"
                />

                <div className="px-4 pb-2 text-xs text-neutral-500 border-b border-neutral-200">
                  {activeNote.date}
                </div>

                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote("content", e.target.value)}
                  className="flex-1 w-full px-4 py-3 text-base leading-relaxed outline-none bg-white resize-none"
                />
              </>
            ) : (
              <div className="flex items-center justify-center flex-1 text-neutral-400">
                Select or create a note
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default NotesPopup;
