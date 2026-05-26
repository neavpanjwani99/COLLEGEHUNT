"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { colleges } from "@/data/colleges";

interface CompareContextValue {
  compareIds: string[];
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("colleges");
    if (ids) {
      const slugs = ids.split(",").filter(Boolean);
      const restored = colleges.filter((college) => slugs.includes(college.slug)).map((college) => college.id);
      setCompareIds(restored);
    }
  }, []);

  const value: CompareContextValue = {
    compareIds,
    toggleCompare: (id) =>
      setCompareIds((current) => {
        if (current.includes(id)) return current.filter((item) => item !== id);
        if (current.length >= 3) return current;
        return [...current, id];
      }),
    removeCompare: (id) => setCompareIds((current) => current.filter((item) => item !== id)),
    clearCompare: () => setCompareIds([]),
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
