"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "collegefind_shortlist";

interface ShortlistContextValue {
  shortlist: string[];
  toggleShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  clearShortlist: () => void;
}

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setShortlist(JSON.parse(stored) as string[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shortlist));
  }, [shortlist]);

  const value: ShortlistContextValue = {
    shortlist,
    toggleShortlist: (id) => setShortlist((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id])),
    isShortlisted: (id) => shortlist.includes(id),
    clearShortlist: () => setShortlist([]),
  };

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (!context) throw new Error("useShortlist must be used within ShortlistProvider");
  return context;
}
