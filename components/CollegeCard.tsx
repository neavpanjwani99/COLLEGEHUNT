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

  return (
    <Card className="flex flex-col overflow-hidden border border-[#E5E7EB] shadow-sm">
      <div className={`flex h-28 items-center justify-center ${streamBg[college.streams[0]] ?? "bg-gray-50"}`}>
        <span className="text-xs font-bold tracking-widest uppercase">{college.streams[0]}</span>
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div>
          <Link href={`/colleges/${college.slug}`} className="text-lg font-bold text-[#111827] hover:text-[#006AFF]">
            {college.name}
          </Link>
          <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#6B7280]">
            <MapPin className="h-4 w-4" />
            <span>{college.city}, {college.state}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-[#006AFF] text-white hover:bg-[#0056CC]">NIRF #{college.nirfRank}</Badge>
          {college.streams.slice(1, 3).map((stream) => (
            <Badge key={stream} className="bg-gray-100 text-gray-700 font-medium">{stream}</Badge>
          ))}
          <Badge className="border-green-200 bg-green-50 text-green-700 font-medium">{college.acreditation}</Badge>
        </div>

        <div className="mt-6 mb-6 grid grid-cols-2 gap-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Avg Package</div>
            <div className="mt-1.5 text-xl font-bold text-[#111827] leading-none">{formatPackage(college.placements[0]?.avgPackage ?? 0)}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Annual Fees</div>
            <div className="mt-1.5 text-xl font-bold text-[#111827] leading-none">{formatFees(college.annualFee)}</div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <Button variant="secondary" className="flex-1 font-semibold border-[#E5E7EB]" onClick={() => toggleShortlist(college.id)}>
            {shortlisted ? <Bookmark className="mr-2 h-4 w-4 fill-current text-[#006AFF]" /> : <BookmarkPlus className="mr-2 h-4 w-4" />}
            {shortlisted ? <span className="text-[#006AFF]">Shortlisted</span> : "Shortlist"}
          </Button>
          <Button variant="secondary" className="flex-1 font-semibold border-[#E5E7EB]" onClick={() => toggleCompare(college.id)}>
            {added ? <Check className="mr-2 h-4 w-4 text-[#006AFF]" /> : null}
            {added ? <span className="text-[#006AFF]">Added</span> : "Compare"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
