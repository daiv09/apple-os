"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { useFullscreen } from "@/app/FullscreenContext";

/**
 * CalendarPopup.tsx
 * Full macOS-style Calendar (Day / Week / Month / Year)
 *
 * Notes:
 * - No external date libraries used.
 * - Styling uses Tailwind classes (adjust if you don't use Tailwind).
 * - Integrates with FullscreenContext: setFullscreen / navbarVisible.
 */

type ViewMode = "day" | "week" | "month" | "year";

type EventItem = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd for whole-day events; optionally include time
  color?: string;
};

const SAMPLE_EVENTS: EventItem[] = [
  {
    id: "e1",
    title: "Chhath Puja",
    date: addDaysISO(todayISO(), -14),
    color: "#C9A3E3",
  },
  {
    id: "e2",
    title: "Guru Nanak Gur...",
    date: addDaysISO(todayISO(), -5),
    color: "#C9A3E3",
  },
  { id: "e3", title: "Red Dot Event", date: todayISO(), color: "#F56565" },
  {
    id: "e4",
    title: "Guru Tegh Baha...",
    date: addDaysISO(todayISO(), 5),
    color: "#C9A3E3",
  },
];

export default function CalendarPopup({ onClose }: { onClose: () => void }) {
  const { navbarVisible, setFullscreen, setNavbarVisible, setDockVisible } =
    useFullscreen();
  const [zoomed, setZoomed] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [view, setView] = useState<ViewMode>("month");
  const [cursorDate, setCursorDate] = useState<Date>(() => new Date());
  const [events, setEvents] = useState<EventItem[]>(() => SAMPLE_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // derived
  const monthTitle = useMemo(() => {
    const d = cursorDate;
    return `${d.toLocaleString(undefined, { month: "long" })} ${d.getFullYear()}`;
  }, [cursorDate]);

  // utilities for navigation
  const gotoToday = () => setCursorDate(new Date());
  const prev = () => {
    setCursorDate((d) => {
      const copy = new Date(d);
      if (view === "month") copy.setMonth(copy.getMonth() - 1);
      else if (view === "week") copy.setDate(copy.getDate() - 7);
      else if (view === "day") copy.setDate(copy.getDate() - 1);
      else if (view === "year") copy.setFullYear(copy.getFullYear() - 1);
      return copy;
    });
  };
  const next = () => {
    setCursorDate((d) => {
      const copy = new Date(d);
      if (view === "month") copy.setMonth(copy.getMonth() + 1);
      else if (view === "week") copy.setDate(copy.getDate() + 7);
      else if (view === "day") copy.setDate(copy.getDate() + 1);
      else if (view === "year") copy.setFullYear(copy.getFullYear() + 1);
      return copy;
    });
  };

  // Day / Week / Month generation helpers
  const monthGrid = useMemo(() => buildMonthGrid(cursorDate), [cursorDate]);
  const weekRange = useMemo(() => buildWeekRange(cursorDate), [cursorDate]);
  const dayIso = dateToISO(cursorDate);

  // event helpers
  const eventsOnDay = (isoDate: string) =>
    events.filter((e) => e.date === isoDate);
  const addEvent = (dateIso: string, title: string) => {
    const ev: EventItem = {
      id: crypto.randomUUID(),
      title,
      date: dateIso,
      color: "#C9A3E3",
    };
    setEvents((s) => [ev, ...s]);
  };

  // Add modal actions
  useEffect(() => {
    if (!showAddModal) setNewTitle("");
  }, [showAddModal]);

  // top offset when zoomed to account for navbar
  const topOffsetClass = zoomed
    ? navbarVisible
      ? "top-[40px]"
      : "top-0"
    : "top-12";

  if (minimized) {
    return (
      <motion.div
        className={`fixed left-1/2 z-[9999] ${topOffsetClass} -translate-x-1/2 w-[300px] h-[44px] bg-white rounded-xl shadow-lg flex items-center justify-between px-4`}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full bg-[#ff5f57] cursor-pointer"
            onClick={() => {
              // If window was fullscreen → restore UI on close
              if (zoomed) {
                setFullscreen(false);
                setNavbarVisible(true);
                setDockVisible(true);
              }
              onClose();
            }}
          />
          <div
            className="h-3 w-3 rounded-full bg-[#ffbd2e]"
            onClick={() => setMinimized(false)}
          />
          <div
            className="h-3 w-3 rounded-full bg-[#28c840]"
            onClick={() => {
              setZoomed(true);
              setFullscreen(true);
            }}
          />
          <div className="ml-3 font-medium">Calendar</div>
        </div>
        <div className="text-sm text-neutral-500">Minimized</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 8 }}
      transition={{ duration: 0.18 }}
      className={`
        fixed z-[9999] ${topOffsetClass} left-1/2 -translate-x-1/2
        bg-white border border-neutral-300 shadow-2xl overflow-hidden rounded-2xl
        ${zoomed ? "w-screen h-screen rounded-none left-0 -translate-x-0" : "w-[1100px] h-[740px]"}
        transition-all duration-200
      `}
    >
      {/* Title / Toolbar */}
      <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center gap-4 select-none">
        {/* traffic lights */}
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full bg-[#ff5f57] cursor-pointer"
            onClick={() => {
              // If window was fullscreen → restore UI on close
              if (zoomed) {
                setFullscreen(false);
                setNavbarVisible(true);
                setDockVisible(true);
              }
              onClose();
            }}
          />
          <div
            className="h-3 w-3 rounded-full bg-[#ffbd2e] cursor-pointer"
            onClick={() => setMinimized(true)}
          />
          <div
            className="h-3 w-3 rounded-full bg-[#28c840] cursor-pointer"
            onClick={() => {
              const next = !zoomed;
              setZoomed(next);
              setFullscreen(next);
            }}
          />
        </div>

        {/* Left title */}
        <div className="ml-2 font-bold text-3xl tracking-tight">
          {monthTitle}
        </div>

        {/* center segmented control */}
        <div className="flex-1 flex justify-center">
          <div className="inline-flex bg-neutral-100 rounded-full p-1 shadow-sm">
            {(["day", "week", "month", "year"] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setView(m)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${view === m ? "bg-white shadow-inner" : "text-neutral-600"}`}
              >
                {capitalize(m)}
              </button>
            ))}
          </div>
        </div>

        {/* right controls */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-neutral-500">
            {cursorDate.toLocaleDateString(undefined, { weekday: "long" })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2 rounded-md hover:bg-neutral-100"
            >
              ←
            </button>
            <button
              onClick={next}
              className="p-2 rounded-md hover:bg-neutral-100"
            >
              →
            </button>
          </div>

          <button
            onClick={gotoToday}
            className="px-3 py-1 rounded-full bg-neutral-100 text-sm"
          >
            Today
          </button>
        </div>
      </div>

      {/* content area */}
      <div className="w-full h-[calc(100%-64px)] bg-white flex">
        {/* Left rail (mini-month when wide + small controls) */}
        <div className="w-64 border-r border-neutral-100 p-4 hidden md:block">
          <div className="text-sm font-semibold mb-2">Mini Calendar</div>
          <MiniMonth
            current={cursorDate}
            onPick={(d) => setCursorDate(d)}
            events={events}
          />
          <div className="mt-4">
            <div className="text-xs text-neutral-500 mb-2">Quick Add</div>
            <div className="flex gap-2">
              <input
                className="flex-1 px-2 py-1 border rounded"
                placeholder="Event title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                className="px-3 bg-blue-600 text-white rounded"
                onClick={() => {
                  if (newTitle.trim()) {
                    addEvent(dateToISO(cursorDate), newTitle);
                    setNewTitle("");
                  }
                }}
              >
                Add
              </button>
            </div>
            <div className="text-xs text-neutral-400 mt-2">
              Click a day also to view details or add event.
            </div>
          </div>
        </div>

        {/* Main calendar panel */}
        <div className="flex-1 p-6 overflow-auto">
          {view === "month" && (
            <div>
              <div className="grid grid-cols-7 gap-1 text-sm text-neutral-600 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {monthGrid.map((row, rIdx) =>
                  row.map((cell) => {
                    const iso = dateToISO(cell.date);
                    const isThisMonth = cell.inMonth;
                    const isToday = iso === todayISO();
                    const evs = eventsOnDay(iso);
                    return (
                      <div
                        key={iso}
                        onClick={() => {
                          setSelectedDate(iso);
                          setShowAddModal(true);
                        }}
                        className={`min-h-[88px] p-3 rounded-lg cursor-pointer transition hover:bg-neutral-50
                          ${isThisMonth ? "bg-white" : "bg-neutral-50 text-neutral-400"}
                          ${isToday ? "ring-2 ring-blue-300" : ""}
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`text-sm ${isThisMonth ? "text-black" : "text-neutral-400"} font-medium`}
                          >
                            {cell.date.getDate()}
                          </div>
                          {evs.length > 0 && (
                            <div
                              className="ml-2 w-6 h-6 rounded-full text-white text-xs flex items-center justify-center"
                              style={{ background: evs[0].color || "#C9A3E3" }}
                            >
                              {evs.length}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 space-y-1">
                          {evs.slice(0, 2).map((e) => (
                            <div
                              key={e.id}
                              className="text-xs rounded-full px-2 py-1 truncate"
                              style={{
                                background: e.color || "#C9A3E3",
                                color: "#1a1a1a",
                              }}
                            >
                              {e.title.length > 24
                                ? e.title.slice(0, 24) + "…"
                                : e.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {view === "week" && (
            <WeekView
              cursorDate={cursorDate}
              events={events}
              onDayClick={(iso) => {
                setSelectedDate(iso);
                setShowAddModal(true);
              }}
            />
          )}

          {view === "day" && (
            <DayView
              date={cursorDate}
              events={events}
              onAdd={(iso) => {
                setSelectedDate(iso);
                setShowAddModal(true);
              }}
            />
          )}

          {view === "year" && (
            <YearView
              baseDate={cursorDate}
              onPickMonth={(d) => setCursorDate(d)}
            />
          )}
        </div>
      </div>

      {/* Add / view modal */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowAddModal(false)}
          />
          <div className="bg-white w-[420px] p-4 rounded-xl z-50 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">
                Events on {formatHuman(selectedDate)}
              </div>
              <button
                className="text-sm text-neutral-500"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-52 overflow-auto mb-3">
              {eventsOnDay(selectedDate).map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-neutral-50"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: ev.color }}
                  />
                  <div className="text-sm">{ev.title}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 border rounded"
                placeholder="New event title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  if (newTitle.trim()) {
                    addEvent(selectedDate, newTitle.trim());
                    setNewTitle("");
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* -------------------------
   Small helper components
   ------------------------- */

function MiniMonth({
  current,
  onPick,
  events,
}: {
  current: Date;
  onPick: (d: Date) => void;
  events: EventItem[];
}) {
  const grid = buildMonthGrid(current);
  return (
    <div className="text-xs">
      <div className="grid grid-cols-7 gap-0 text-center text-neutral-500 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((x) => (
          <div key={x} className="py-0.5">
            {x}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {grid.flat().map((cell) => {
          const iso = dateToISO(cell.date);
          const isThisMonth = cell.inMonth;
          const isToday = iso === todayISO();
          const hasEvent = events.some((e) => e.date === iso);
          return (
            <button
              key={iso}
              onClick={() => onPick(cell.date)}
              className={`p-2 text-[12px] ${isThisMonth ? "text-neutral-800" : "text-neutral-300"} ${isToday ? "bg-blue-100 rounded" : ""}`}
            >
              <div className="relative">
                <div>{cell.date.getDate()}</div>
                {hasEvent && (
                  <div className="absolute -right-1 -bottom-1 w-1.5 h-1.5 rounded-full bg-purple-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  cursorDate,
  events,
  onDayClick,
}: {
  cursorDate: Date;
  events: EventItem[];
  onDayClick: (iso: string) => void;
}) {
  const week = buildWeekRange(cursorDate);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {week.map((d) => {
          const iso = dateToISO(d);
          return (
            <div
              key={iso}
              className="flex-1 p-3 bg-neutral-50 rounded-lg cursor-pointer"
              onClick={() => onDayClick(iso)}
            >
              <div className="text-sm font-medium">
                {d.toLocaleDateString(undefined, { weekday: "short" })}{" "}
                <span className="text-xs text-neutral-500"> {d.getDate()}</span>
              </div>
              <div className="mt-2 space-y-2">
                {events
                  .filter((e) => e.date === iso)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="text-sm rounded-full px-2 py-1 inline-block"
                      style={{ background: ev.color }}
                    >
                      {ev.title}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-64 border rounded-lg p-4 overflow-auto text-sm text-neutral-600">
        <div className="text-xs text-neutral-400">
          Week grid (hour slots omitted for brevity)
        </div>
      </div>
    </div>
  );
}

function DayView({
  date,
  events,
  onAdd,
}: {
  date: Date;
  events: EventItem[];
  onAdd: (iso: string) => void;
}) {
  const iso = dateToISO(date);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-neutral-500">
            {date.toLocaleDateString()}
          </div>
        </div>
        <div>
          <button
            onClick={() => onAdd(iso)}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Add
          </button>
        </div>
      </div>

      <div className="border rounded-lg p-4 min-h-[420px]">
        {events.filter((e) => e.date === iso).length === 0 ? (
          <div className="text-neutral-400">No events today</div>
        ) : (
          events
            .filter((e) => e.date === iso)
            .map((ev) => (
              <div
                key={ev.id}
                className="p-2 rounded mb-2"
                style={{ background: ev.color }}
              >
                {ev.title}
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function YearView({
  baseDate,
  onPickMonth,
}: {
  baseDate: Date;
  onPickMonth: (d: Date) => void;
}) {
  const year = baseDate.getFullYear();
  const months = [...Array(12)].map((_, i) => {
    const d = new Date(year, i, 1);
    return { date: d, label: d.toLocaleString(undefined, { month: "short" }) };
  });

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {months.map((m) => (
          <div
            key={m.label}
            onClick={() => onPickMonth(m.date)}
            className="p-4 rounded-lg border hover:shadow-sm cursor-pointer"
          >
            <div className="font-semibold">
              {m.date.toLocaleString(undefined, { month: "long" })}
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              {m.date.getFullYear()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------
   Date helpers (no libs)
   ------------------------- */

function todayISO() {
  return dateToISO(new Date());
}

function dateToISO(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysISO(iso: string, delta: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return dateToISO(d);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Build a 6x7 month grid (rows x cols) containing date objects and a flag if they belong to the month.
 */
function buildMonthGrid(base: Date) {
  const firstOfMonth = new Date(base.getFullYear(), base.getMonth(), 1);
  const startDay = firstOfMonth.getDay(); // 0..6 (Sun..Sat)
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - startDay); // start on Sunday of the week containing 1st
  const grid: { date: Date; inMonth: boolean }[][] = [];
  const cur = new Date(startDate);
  for (let r = 0; r < 6; r++) {
    const row: { date: Date; inMonth: boolean }[] = [];
    for (let c = 0; c < 7; c++) {
      row.push({
        date: new Date(cur),
        inMonth: cur.getMonth() === base.getMonth(),
      });
      cur.setDate(cur.getDate() + 1);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Build week (Sunday..Saturday) array of Date objects that contains cursorDate
 */
function buildWeekRange(cursor: Date) {
  const day = cursor.getDay();
  const start = new Date(cursor);
  start.setDate(cursor.getDate() - day);
  const arr: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    arr.push(d);
  }
  return arr;
}

function formatHuman(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
