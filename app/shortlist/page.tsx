"use client"; // uses shortlist context jho client side pe avail hai 

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { colleges } from "@/data/colleges";
import { useShortlist } from "@/context/ShortlistContext";
import { CollegeCard } from "@/components/CollegeCard";
import { Button } from "@/components/ui";

import { useState, useEffect } from "react";

export default function ShortlistPage() {
  const { shortlist, clearShortlist } = useShortlist(); // shortlist context se shortlisted college ids le raha hai
  const selected = colleges.filter((college) => shortlist.includes(college.id)); // data file se un colleges ko filter kar raha hai jinke ids shortlist me hain
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white px-6 pt-10 pb-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#222222]">My Shortlist</h1>
            <p className="mt-2 text-[#717171] font-medium">{selected.length} colleges saved</p>
          </div>
          {selected.length > 0 && (
            <button type="button" className="text-sm font-bold text-[#FF385C] hover:underline" onClick={clearShortlist}>
              Clear all shortlist
            </button>
          )}
        </div>
        {selected.length === 0 ? (
          <div className="mt-8 max-w-[500px] mx-auto border border-gray-200 rounded-2xl bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#FFF0F2] text-[#FF385C] rounded-full flex items-center justify-center mb-6">
              <Bookmark className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[#222222]">No colleges shortlisted yet</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#717171] font-medium">
              Save colleges while browsing to compare them easily and track your applications in one place.
            </p>
            <Link href="/colleges" className="mt-6">
              <Button className="rounded-full bg-[#FF385C] hover:bg-[#E61E4D] font-bold text-white px-6 py-2.5 h-11 border-none shadow-sm transition-all">
                Browse Colleges
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {selected.map((college) => <CollegeCard key={college.id} college={college} />)}
          </div>
        )}
      </div>
    </div>
  );
}
