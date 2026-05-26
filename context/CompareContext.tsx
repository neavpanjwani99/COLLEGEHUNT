"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { colleges } from "@/data/colleges";
import { X } from "lucide-react";

interface CompareContextValue {
  compareIds: string[];
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("colleges");
    if (ids) {
      const slugs = ids.split(",").filter(Boolean);
      const restored = colleges.filter((college) => slugs.includes(college.slug)).map((college) => college.id);
      setCompareIds(restored);
    }
  }, []);

  // Auto-dismiss error message after 4 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const value: CompareContextValue = {
    compareIds,
    toggleCompare: (id) =>
      setCompareIds((current) => {
        if (current.includes(id)) return current.filter((item) => item !== id);
        if (current.length >= 3) {
          setErrorMessage("SRS Requirement: You can compare a maximum of 3 colleges at a time to prevent UI layout density.");
          return current;
        }
        return [...current, id];
      }),
    removeCompare: (id) => setCompareIds((current) => current.filter((item) => item !== id)),
    clearCompare: () => setCompareIds([]),
    errorMessage,
    setErrorMessage,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
      {errorMessage && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm rounded-lg border border-red-200 bg-[#FEF2F2] p-4 shadow-xl flex items-start gap-3 animate-none">
          <div className="flex-1 text-sm font-semibold text-[#991B1B]">
            {errorMessage}
          </div>
          <button type="button" onClick={() => setErrorMessage(null)} className="text-[#EF4444] hover:text-[#991B1B]">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
