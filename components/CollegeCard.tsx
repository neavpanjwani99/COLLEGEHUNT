"use client";

import Link from "next/link";
import { Bookmark, BookmarkPlus, Check, MapPin } from "lucide-react";
import type { College } from "@/types";
import { Badge, Button, Card } from "@/components/ui";
import { formatFees, formatPackage } from "@/lib/utils";
import { useCompare } from "@/context/CompareContext";
import { useShortlist } from "@/context/ShortlistContext";

const streamBg: Record<string, string> = {
  Engineering: "bg-[#EFF6FF] text-[#2563EB]",
  Medical: "bg-[#F0FDF4] text-[#16A34A]",
  Commerce: "bg-[#FFFBEB] text-[#D97706]",
  Law: "bg-[#FDF4FF] text-[#C026D3]",
  Arts: "bg-[#FFF7ED] text-[#EA580C]",
};

export function CollegeCard({ college }: { college: College }) {
  const { toggleShortlist, isShortlisted } = useShortlist();
  const { compareIds, toggleCompare } = useCompare();
  const shortlisted = isShortlisted(college.id);
  const added = compareIds.includes(college.id);

  let domain = "";
  try {
    domain = new URL(college.website).hostname;
  } catch (e) {
    // fallback
  }

  return (
    <Card className="flex flex-col overflow-hidden border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative flex h-[120px] items-center justify-center bg-gray-100">
        <img src={college.banner} alt={`${college.name} campus`} className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <span className="absolute left-4 top-4 rounded bg-black/40 px-2 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">{college.streams[0]}</span>
        
        {/* Dynamic College Logo */}
        <div className="absolute -bottom-8 left-6 h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-white p-1.5 shadow-sm">
          <img 
            src={college.logo} 
            alt={college.name} 
            className="h-full w-full object-contain"
            onError={(e) => { 
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&background=f3f4f6&color=111827&bold=true`; 
            }}
          />
        </div>
      </div>
      
      <div className="flex flex-1 flex-col px-6 pb-6 pt-12">
        <div>
          <Link href={`/colleges/${college.slug}`} className="line-clamp-2 text-lg md:text-[20px] font-bold leading-tight text-[#111827] hover:text-[#006AFF] transition-colors">
            {college.name}
          </Link>
          <div className="mt-2.5 flex items-center gap-1.5 text-sm font-medium text-[#6B7280]">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{college.city}, {college.state}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-[#006AFF] text-white hover:bg-[#0056CC]">NIRF #{college.nirfRank}</Badge>
          {college.streams.slice(1, 3).map((stream) => (
            <Badge key={stream} className="bg-gray-100 text-gray-700 font-medium">{stream}</Badge>
          ))}
          <Badge className="border-green-200 bg-green-50 text-green-700 font-medium">{college.acreditation}</Badge>
        </div>

        <div className="mt-6 mb-6 grid grid-cols-2 gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
          <div className="overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Avg Package</div>
            <div className="mt-1.5 truncate text-[18px] md:text-[20px] font-bold text-[#111827] leading-none tracking-tight">{formatPackage(college.placements[0]?.avgPackage ?? 0)}</div>
          </div>
          <div className="overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Annual Fees</div>
            <div className="mt-1.5 truncate text-[18px] md:text-[20px] font-bold text-[#111827] leading-none tracking-tight">{formatFees(college.annualFee)}</div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <Button variant="secondary" className="flex-1 font-semibold border-[#E5E7EB] shadow-sm transition-colors hover:bg-gray-50" onClick={() => toggleShortlist(college.id)}>
            {shortlisted ? <Bookmark className="mr-2 h-4 w-4 fill-current text-[#006AFF]" /> : <BookmarkPlus className="mr-2 h-4 w-4 text-[#6B7280]" />}
            {shortlisted ? <span className="text-[#006AFF]">Saved</span> : "Shortlist"}
          </Button>
          <Button variant="secondary" className="flex-1 font-semibold border-[#E5E7EB] shadow-sm transition-colors hover:bg-gray-50" onClick={() => toggleCompare(college.id)}>
            {added ? <Check className="mr-2 h-4 w-4 text-[#006AFF]" /> : null}
            {added ? <span className="text-[#006AFF]">Added</span> : "Compare"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
