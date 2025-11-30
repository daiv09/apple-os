// src/components/SpotlightSearch.tsx (Modified for Autocomplete & App Open)
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// --- App Popup Imports ---
// Assuming these components are correctly defined in their respective paths
import TerminalPopup from "../TerminalPopup";
import NotesPopup from "./NotesPopup";
import SafariPopup from "./SafariPopup";
import CalculatorPopup from "../CalculatorPopup";
import PhotosPopup from "./PhotosPopup";
import MusicPopup from "./MusicPopup";
import MailPopup from "./MailPopup";
import CalendarPopup from "./CalenderPopup";
import FinderPopup from "./FinderPopup";

// --- Context Imports (assuming paths are correct) ---
import { useApp } from '@/contexts/AppContext';
import { useFullscreen } from "@/app/FullscreenContext";

// --- Sample App Data ---
const DOCK_APPS = [
    { id: "finder", name: "Finder", action: "open-finder" },
    { id: "calculator", name: "Calculator", action: "open-calculator" },
    { id: "terminal", name: "Terminal", action: "open-terminal" },
    { id: "mail", name: "Mail", action: "open-mail" },
    { id: "notes", name: "Notes", action: "open-notes" },
    { id: "safari", name: "Safari", action: "open-safari" },
    { id: "photos", name: "Photos", action: "open-photos" },
    { id: "music", name: "Music", action: "open-music" },
    { id: "calendar", name: "Calendar", action: "open-calendar" }
];

// --- Configuration: Define searchable items ---
const SEARCH_ITEMS = [
    { name: "About Me", path: "/about", description: "Who I am, what I do" },
    { name: "Projects", path: "/projects", description: "All my work and case studies" },
    { name: "Skills & Tech Stack", path: "/skills", description: "Technologies and proficiencies" },
    { name: "Work Experience", path: "/experience", description: "Professional history" },
    { name: "Resume (PDF)", path: "/resume", description: "Download or view my resume" },
    { name: "Contact Me", path: "/contact", description: "Send an email or connect" },
    { name: "Visit GitHub", action: "open-github", description: "External link to my repository" },
    { name: "Switch to Dark Mode", action: "dark-mode", description: "Change theme to dark" },
    { name: "Switch to Light Mode", action: "light-mode", description: "Change theme to light" },
    { name: "Reload Portfolio", action: "reload-portfolio", description: "Refresh the current page" },
];

// --- Types ---
interface SearchItem {
    name: string;
    path?: string;
    action?: string;
    appId?: string; // New: for opening apps
    description: string;
}

// Map DOCK_APPS to Search Items
const APP_SEARCH_ITEMS: SearchItem[] = DOCK_APPS.map(app => ({
    name: `Open ${app.name}`,
    appId: app.id,
    description: `Launch the ${app.name} application`,
}));

const ALL_SEARCHABLE_ITEMS: SearchItem[] = [...APP_SEARCH_ITEMS, ...SEARCH_ITEMS];

interface SpotlightSearchProps {
    isOpen: boolean;
    onClose: () => void;
    // Note: The logic for simple menu actions (like dark-mode, reload) remains here.
    // The main app opening logic has been moved into this component to manage its state.
    handleAppOrMenuAction: (actionId: string) => void; 
}

// Map app IDs to their state setters for centralized management
const appStateMap = {
    terminal: { setter: 'setShowTerminal', isMinimized: 'isTerminalMinimized', setMinimized: 'setIsTerminalMinimized' },
    notes: { setter: 'setShowNotes' },
    safari: { setter: 'setShowSafari' },
    calculator: { setter: 'setShowCalculator' },
    photos: { setter: 'setShowPhotos' },
    music: { setter: 'setShowMusic' },
    mail: { setter: 'setShowMail' },
    calendar: { setter: 'setShowCalendar' },
    finder: { setter: 'setShowFinder' },
} as const;


const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ isOpen, onClose, handleAppOrMenuAction }) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const { setCurrentApp } = useApp();
    const { isFullscreen, dockVisible, setDockVisible } = useFullscreen();

    // --- Search State ---
    const [query, setQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState<SearchItem[]>(ALL_SEARCHABLE_ITEMS);
    const [activeIndex, setActiveIndex] = useState(0);
    const [autofillText, setAutofillText] = useState('');

    

    // --- App State Management ---
    const [openApps, setOpenApps] = useState<string[]>([]);
    const [showTerminal, setShowTerminal] = useState(false);
    const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [showSafari, setShowSafari] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    const [showPhotos, setShowPhotos] = useState(false);
    const [showMusic, setShowMusic] = useState(false);
    const [showMail, setShowMail] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showFinder, setShowFinder] = useState(true); // Finder open by default

    // Helper map of app states for use in handleAppClick/executeAction
    const appStateSetters = {
        setShowTerminal, setIsTerminalMinimized,
        setShowNotes, setShowSafari, setShowCalculator,
        setShowPhotos, setShowMusic, setShowMail,
        setShowCalendar, setShowFinder,
    };
    const appStateValues = {
        showTerminal, isTerminalMinimized,
        showNotes, showSafari, showCalculator,
        showPhotos, showMusic, showMail,
        showCalendar, showFinder,
    };
    
    // Ensure input is focused when open
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setQuery(''); // Reset query on open
            setFilteredResults(ALL_SEARCHABLE_ITEMS); // Show all results initially
        }
    }, [isOpen]);


    // --- Core Search & Filter Logic ---
    useEffect(() => {
        if (!isOpen) return;

        const lowerQuery = query.toLowerCase();

        if (lowerQuery.length === 0) {
            setFilteredResults(ALL_SEARCHABLE_ITEMS);
            setAutofillText('');
        } else {
            const results = ALL_SEARCHABLE_ITEMS.filter(item =>
                item.name.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery)
            ).sort((a, b) => {
                // Prioritize results that start with the query
                const aStarts = a.name.toLowerCase().startsWith(lowerQuery);
                const bStarts = b.name.toLowerCase().startsWith(lowerQuery);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                // Secondary sort: App results first
                if (a.appId && !b.appId) return -1;
                if (!a.appId && b.appId) return 1;
                return a.name.localeCompare(b.name);
            });

            setFilteredResults(results);

            // --- AUTOFILL LOGIC ---
            if (results.length > 0 && results[0].name.toLowerCase().startsWith(lowerQuery)) {
                const suggestedText = results[0].name;
                setAutofillText(suggestedText.substring(query.length));
            } else {
                setAutofillText('');
            }
        }

        setActiveIndex(0); // Reset selection on new filter
    }, [query, isOpen]);

    // --- CORE APP CLICK HANDLER (Centralized App Window Management) ---
    // This logic must live here because this component manages all the `showApp` state variables.
    const handleAppClick = useCallback((appId: string | null | undefined) => {
        if (!appId || typeof appId !== 'string') {
            console.error("handleAppClick received invalid appId:", appId);
            return;
        }

        const appConfig = appStateMap[appId as keyof typeof appStateMap];
        const isRunning = openApps.includes(appId);
        const isVisible = appStateValues[`show${appId.charAt(0).toUpperCase() + appId.slice(1)}` as keyof typeof appStateValues];
        const isMinimized = appConfig?.isMinimized ? appStateValues[appConfig.isMinimized as keyof typeof appStateValues] : false;

        // --- Handle Quit Action (if necessary) ---
        if (appId.startsWith("quit:")) {
            const realId = appId.replace("quit:", "");
            setOpenApps((prev) => prev.filter((id) => id !== realId));
            const quitConfig = appStateMap[realId as keyof typeof appStateMap];
            if (quitConfig) {
                appStateSetters[quitConfig.setter as keyof typeof appStateSetters](false);
                if (quitConfig.setMinimized) {
                    appStateSetters[quitConfig.setMinimized as keyof typeof appStateSetters](false);
                }
            }
            setCurrentApp("Finder");
            return;
        }

        // --- Handle Terminal Special Case (Minimize/Restore) ---
        if (appId === "terminal") {
            if (isRunning && isVisible && !isMinimized) { // Running, visible -> Minimize
                setIsTerminalMinimized(true);
                setCurrentApp("Finder");
                return;
            }
            if (isRunning && isMinimized) { // Running, minimized -> Restore
                setIsTerminalMinimized(false);
                setShowTerminal(true);
                setCurrentApp("Terminal");
                return;
            }
        }

        // --- General App Toggle Logic ---
        if (isRunning) {
            // Running: Toggle visibility (Show -> Hide, Hide -> Show)
            appStateSetters[appConfig.setter as keyof typeof appStateSetters](!isVisible);
            setCurrentApp(isVisible ? "Finder" : appId.charAt(0).toUpperCase() + appId.slice(1));
        } else {
            // Not running: Launch
            setOpenApps((prev) => [...prev, appId]);
            appStateSetters[appConfig.setter as keyof typeof appStateSetters](true);
            setCurrentApp(appId.charAt(0).toUpperCase() + appId.slice(1));
        }
        
    }, [openApps, setCurrentApp, appStateSetters, appStateValues]);

    // --- Action Handler ---
    const executeAction = useCallback((item: SearchItem) => {
        if (item.path) {
            router.push(item.path);
        } else if (item.appId) {
            // Launch the app using the centralized handler
            handleAppClick(item.appId);
        } else if (item.action) {
            // Execute the action (e.g., dark-mode, reload-portfolio)
            handleAppOrMenuAction(item.action);
        }
        onClose(); // Close search after action
    }, [router, onClose, handleAppClick, handleAppOrMenuAction]);

    // --- Keyboard Navigation ---
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredResults.length > 0) {
                    // 1. If there's autofill text, complete the query
                    if (autofillText.length > 0) {
                        setQuery(query + autofillText);
                        setAutofillText('');
                    } else {
                        // 2. Execute the action for the currently selected item
                        executeAction(filteredResults[activeIndex]);
                    }
                }
                break;
            case 'Tab':
            case 'ArrowRight': 
                if (e.key === 'Tab') e.preventDefault();
                if (autofillText.length > 0) {
                    setQuery(query + autofillText);
                    setAutofillText('');
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [isOpen, filteredResults, activeIndex, executeAction, onClose, query, autofillText]);

    // Attach global keydown listener (for escape)
    useEffect(() => {
        const globalHandleKeyPress = (e: KeyboardEvent) => {
            if (isOpen) {
                // Use the shared handler for global keys like Escape
                handleKeyDown(e);
            }
        };

        window.addEventListener('keydown', globalHandleKeyPress);
        return () => window.removeEventListener('keydown', globalHandleKeyPress);
    }, [isOpen, handleKeyDown]);


    // If the spotlight is not open, render null to hide it completely (performance)
    if (!isOpen) return (
        <>
            {/* Must render popups even when spotlight is closed */}
            {/* This code section remains outside the main return for the pop-up logic,
                which is crucial for the application structure. */}
            {/* Terminal Popup (only shown if running AND not minimized) */}
            {openApps.includes("terminal") && showTerminal && !isTerminalMinimized && (
                <TerminalPopup
                    onClose={() => handleAppClick("quit:terminal")}
                    onMinimize={() => setIsTerminalMinimized(true)} // Added minimize handler
                />
            )}

            {/* Notes Popup (only shown if running) */}
            {openApps.includes("notes") && showNotes && (
                <NotesPopup onClose={() => handleAppClick("quit:notes")} />
            )}

            {openApps.includes("safari") && showSafari && (
                <SafariPopup onClose={() => handleAppClick("quit:safari")} />
            )}

            {openApps.includes("calculator") && showCalculator && (
                <CalculatorPopup onClose={() => handleAppClick("quit:calculator")} />
            )}

            {openApps.includes("photos") && showPhotos && (
                <PhotosPopup onClose={() => handleAppClick("quit:photos")} />
            )}

            {openApps.includes("music") && showMusic && (
                <MusicPopup onClose={() => handleAppClick("quit:music")} />
            )}

            {openApps.includes("mail") && showMail && (
                <MailPopup onClose={() => handleAppClick("quit:mail")} />
            )}

            {openApps.includes("calendar") && showCalendar && (
                <CalendarPopup onClose={() => handleAppClick("quit:calendar")} />
            )}

            {openApps.includes("finder") && showFinder && (
                <FinderPopup onClose={() => handleAppClick("quit:finder")} />
            )}
        </>
    );

    // --- Main Spotlight Search Render ---
    return (
        <>
            {/* App Popups (Rendered when spotlight is open or closed, based on app state) */}
            {/* Note: I'm keeping the popup render logic outside the main 'if (!isOpen) return null' block
               but you might want to adjust the prop-passing structure or use a memoized component
               to avoid re-rendering issues, though the current structure is functional. */}

            {/* Terminal Popup (only shown if running AND not minimized) */}
            {openApps.includes("terminal") && showTerminal && !isTerminalMinimized && (
                <TerminalPopup
                    onClose={() => handleAppClick("quit:terminal")}
                    onMinimize={() => setIsTerminalMinimized(true)}
                />
            )}

            {/* Notes Popup (only shown if running) */}
            {openApps.includes("notes") && showNotes && (
                <NotesPopup onClose={() => handleAppClick("quit:notes")} />
            )}

            {openApps.includes("safari") && showSafari && (
                <SafariPopup onClose={() => handleAppClick("quit:safari")} />
            )}

            {openApps.includes("calculator") && showCalculator && (
                <CalculatorPopup onClose={() => handleAppClick("quit:calculator")} />
            )}

            {openApps.includes("photos") && showPhotos && (
                <PhotosPopup onClose={() => handleAppClick("quit:photos")} />
            )}

            {openApps.includes("music") && showMusic && (
                <MusicPopup onClose={() => handleAppClick("quit:music")} />
            )}

            {openApps.includes("mail") && showMail && (
                <MailPopup onClose={() => handleAppClick("quit:mail")} />
            )}

            {openApps.includes("calendar") && showCalendar && (
                <CalendarPopup onClose={() => handleAppClick("quit:calendar")} />
            )}

            {openApps.includes("finder") && showFinder && (
                <FinderPopup onClose={() => handleAppClick("quit:finder")} />
            )}
            

            {/* --- SPOTLIGHT UI --- */}
            <div
                className="fixed inset-0 z-[100] flex items-start justify-center pt-24"
                onClick={(e) => {
                    // Close if clicked outside the search bar
                    const target = e.target as HTMLElement;
                    if (target.id === 'spotlight-background') {
                        onClose();
                    }
                }}
                id="spotlight-background" // ID for click detection
            >
                <div
                    className="w-11/12 max-w-xl backdrop-blur-3xl p-2 rounded-xl text-white shadow-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    {/* Input Area */}
                    <div className="relative flex items-center space-x-3 p-2">
                        {/* Autofill Text Layer (Absolute positioning) */}
                        {autofillText.length > 0 && (
                            <div className="absolute top-2.5 left-10 pointer-events-none text-white/50 whitespace-pre">
                                <span className="opacity-0">{query}</span>
                                <span className="font-light">{autofillText}</span>
                            </div>
                        )}

                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search Portfolio, Apps, or Contact..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown as React.KeyboardEventHandler<HTMLInputElement>}
                            className="w-full bg-transparent border-none focus:outline-none placeholder-white/50 text-base relative z-10"
                        />
                    </div>

                    {/* Results List */}
                    {/* Condition: show results when query is non-empty OR when all results are shown initially (query.length === 0) */}
                    {filteredResults.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/20 max-h-80 overflow-y-auto">
                            {filteredResults.map((item, index) => (
                                <div
                                    key={item.name}
                                    className={`
                                p-2 rounded-lg cursor-pointer transition-colors duration-150
                                ${index === activeIndex ? 'bg-blue-500/70' : 'hover:bg-white/10'}
                                flex justify-between items-center
                                `}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => executeAction(item)}
                                >
                                    <div>
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className={`text-xs ${index === activeIndex ? 'text-white/80' : 'text-white/50'}`}>
                                            {item.description}
                                        </p>
                                    </div>
                                    <span className="text-xs font-semibold text-white/50">
                                        {item.appId ? 'APP' : (item.path ? 'NAV' : 'ACTION')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {query.length > 0 && filteredResults.length === 0 && (
                        <div className="p-4 text-center text-white/50 text-sm">
                            No results found for **"{query}"**.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SpotlightSearch;