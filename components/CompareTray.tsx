"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { useCompare } from "@/context/CompareContext";
import { colleges } from "@/data/colleges";

import { useState, useEffect } from "react";

export function CompareTray() {
  const { compareIds, removeCompare } = useCompare();
  const selected = colleges.filter((college) => compareIds.includes(college.id));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || selected.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white px-6 py-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
        <div className="text-sm text-[#374151]">Comparing {selected.length} colleges</div>
        <div className="flex flex-wrap items-center gap-2">
          {selected.map((college) => (
            <span key={college.id} className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] px-3 py-1 text-sm">
              {college.name}
              <button type="button" onClick={() => removeCompare(college.id)}>
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <Link href="/compare">
          <Button>Compare Now</Button>
        </Link>
      </div>
    </div>
  );
}
