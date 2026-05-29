"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { useCompare } from "@/context/CompareContext";
import { colleges } from "@/data/colleges";
import { useState, useEffect } from "react";

export function CompareTray() {
  const { compareIds, toggleCompare } = useCompare();
  const selected = colleges.filter((college) => compareIds.includes(college.id));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || selected.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white px-6 py-4 shadow-xl">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4">
        <div className="text-sm text-[#374151] font-bold">Selected {selected.length} colleges for comparison</div>
        <div className="flex flex-wrap items-center gap-2">
          {selected.map((college) => (
            <span key={college.id} className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-sm font-semibold text-[#374151]">
              {college.name}
              <button type="button" onClick={() => toggleCompare(college.id)} className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <Link href={`/compare?ids=${compareIds.join(",")}`}>
          <Button className="bg-brand-red hover:bg-brand-red-hover text-white font-bold h-10 px-5 rounded-lg border-none">Compare Now</Button>
        </Link>
      </div>
    </div>
  );
}
