"use client"; // uses shortlist context jho client side pe avail hai 

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { colleges } from "@/data/colleges";
import { useShortlist } from "@/context/ShortlistContext";
import { CollegeCard } from "@/components/CollegeCard";
import { Button } from "@/components/ui";

export default function ShortlistPage() {
  const { shortlist, clearShortlist } = useShortlist(); // shortlist context se shortlisted college ids le raha hai
  const selected = colleges.filter((college) => shortlist.includes(college.id)); // data file se un colleges ko filter kar raha hai jinke ids shortlist me hain

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Shortlist</h1>
            <p className="mt-2 text-[#6B7280]">{selected.length} colleges saved</p>
          </div>
          <button type="button" className="text-sm text-[#006AFF]" onClick={clearShortlist}>
            Clear all shortlist
          </button>
        </div>
        {selected.length === 0 ? (
          <div className="py-20 text-center">
            <Bookmark className="mx-auto h-12 w-12 text-[#9CA3AF]" />
            <div className="mt-4 text-xl font-semibold">No colleges shortlisted yet</div>
            <Link href="/colleges">
              <Button className="mt-4">Browse colleges</Button>
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
