// src/components/SpotlightSearch.tsx (Modified for Autocomplete & App Open)
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Sample apps list from NewDock (for filtering app IDs)
const DOCK_APPS = [
    { id: "finder", name: "Finder" },
    { id: "calculator", name: "Calculator" },
    { id: "terminal", name: "Terminal" },
    { id: "mail", name: "Mail" },
    { id: "notes", name: "Notes" },
    { id: "safari", name: "Safari" },
    { id: "photos", name: "Photos" },
    { id: "music", name: "Music" },
    { id: "calendar", name: "Calendar" }
];

// --- Configuration: Define searchable items ---
const SEARCH_ITEMS = [
    // Apps are now dynamically added below
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

// Map DOCK_APPS to Search Items
const APP_SEARCH_ITEMS: SearchItem[] = DOCK_APPS.map(app => ({
    name: `Open ${app.name}`,
    appId: app.id,
    description: `Launch the ${app.name} application`,
}));

const ALL_SEARCHABLE_ITEMS = [...APP_SEARCH_ITEMS, ...SEARCH_ITEMS];


// --- Types ---
interface SearchItem {
    name: string;
    path?: string;
    action?: string;
    appId?: string; // New: for opening apps
    description: string;
}

interface SpotlightSearchProps {
    isOpen: boolean;
    onClose: () => void;
    // Updated prop to handle both menu bar actions and app clicks
    handleAppOrMenuAction: (actionId: string) => void; 
}

const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ isOpen, onClose, handleAppOrMenuAction }) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState<SearchItem[]>(ALL_SEARCHABLE_ITEMS);
    const [activeIndex, setActiveIndex] = useState(0);
    const [autofillText, setAutofillText] = useState(''); // New state for autofill

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
                return a.name.localeCompare(b.name);
            });
            
            setFilteredResults(results);

            // --- AUTOFILL LOGIC ---
            if (results.length > 0 && results[0].name.toLowerCase().startsWith(lowerQuery)) {
                const suggestedText = results[0].name;
                // Autofill text is the part of the suggestion that comes after the query
                setAutofillText(suggestedText.substring(query.length));
            } else {
                setAutofillText('');
            }
        }
        
        setActiveIndex(0); // Reset selection on new filter
    }, [query, isOpen]);

    // --- Action Handler ---
    const executeAction = useCallback((item: SearchItem) => {
        if (item.path) {
            router.push(item.path);
        } else if (item.action || item.appId) {
            // Use the combined handler for both menu bar actions (action) and app opening (appId)
            const actionId = item.action || item.appId || '';
            if (actionId) {
                handleAppOrMenuAction(actionId);
            }
        }
        onClose(); // Close search after action
    }, [router, onClose, handleAppOrMenuAction]);

    // --- Keyboard Navigation ---
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
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
                        // If there is autofill text, treat Enter as accepting the suggestion
                        if (autofillText.length > 0) {
                            setQuery(query + autofillText);
                            // Do not close yet, wait for the second Enter to execute
                        } else {
                            executeAction(filteredResults[activeIndex]);
                        }
                    }
                    break;
                case 'Tab':
                case 'ArrowRight': // Use ArrowRight to accept suggestion (like zsh completion)
                    if (e.key === 'Tab') e.preventDefault();
                    if (autofillText.length > 0) {
                        setQuery(query + autofillText);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, filteredResults, activeIndex, executeAction, onClose, query, autofillText]);

    if (!isOpen) return null;

    return (
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
                {/* Input Area (Using relative container for autofill) */}
                <div className="relative flex items-center space-x-3 p-2">
                    {/* Autofill Text Layer (Absolute positioning) */}
                    {autofillText.length > 0 && (
                        <div className="absolute top-2.5 left-10 pointer-events-none text-white/50 whitespace-pre">
                            <span className="opacity-0">{query}</span> 
                            <span className="font-light">{autofillText}</span>
                        </div>
                    )}

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.65 16.65" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search Portfolio, Apps, or Contact..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none placeholder-white/50 text-base relative z-10"
                    />
                </div>

                {/* Results List */}
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
                                {(item.path || item.action || item.appId) && (
                                    <span className="text-xs font-semibold text-white/50">
                                        {item.appId ? 'APP' : (item.path ? 'NAV' : 'ACTION')}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                {/* No Results */}
                {query.length > 0 && filteredResults.length === 0 && (
                    <div className="p-4 text-center text-white/50 text-sm">
                        No results found for "{query}".
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpotlightSearch;