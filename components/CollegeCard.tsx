// adjusted font sizes and spacing inside college card
"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Check, MapPin, Calendar, Layers } from "lucide-react";
import type { College } from "@/types";
import { Badge, Button, Card } from "@/components/ui";
import { formatFees, formatPackage } from "@/lib/utils";
import { useCompare } from "@/context/CompareContext";
import { useShortlist } from "@/context/ShortlistContext";

export function CollegeCard({ college }: { college: College }) {
  const { toggleShortlist, isShortlisted } = useShortlist();
  const { compareIds, toggleCompare } = useCompare();
  const shortlisted = isShortlisted(college.id);
  const added = compareIds.includes(college.id);

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden border border-brand-border-light shadow-card mb-4 rounded-xl bg-white max-w-full">
      {/* College Banner Container */}
      <div className="relative flex h-[160px] md:h-auto md:w-[260px] shrink-0 bg-brand-bg-soft">
        <Image
          src={college.banner || "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800"}
          alt={`${college.name} campus banner`}
          width={260}
          height={160}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-text-primary/60 via-transparent to-brand-text-primary/20" />
        <span className="absolute left-4 top-4 rounded bg-brand-text-primary/55 px-2 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm">
          {college.streams[0] || "General"}
        </span>
      </div>

      {/* College Details Context */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            
            {/* Logo */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-brand-border-light p-1 bg-white relative flex items-center justify-center">
              <Image
                src={college.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&background=fff0f2&color=ff385c&bold=true`}
                alt={`${college.name} official logo`}
                width={64}
                height={64}
                className="object-contain max-h-full max-w-full"
              />
            </div>

            <div>
              <Link
                href={`/colleges/${college.slug}`}
                className="line-clamp-2 text-[18px] md:text-[20px] font-bold leading-tight text-brand-text-primary hover:text-brand-red transition-colors"
              >
                {college.name}
              </Link>
              <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-text-muted">
                <MapPin className="h-4 w-4 text-brand-red shrink-0" />
                <span className="truncate">{college.city}, {college.state}</span>
              </div>
            </div>
          </div>

          {/* NIRF and NAAC Badges */}
          <div className="flex flex-wrap gap-2 md:justify-end shrink-0">
            <Badge className="bg-brand-red text-white hover:bg-brand-red-hover border-transparent font-bold">
              NIRF Rank: {college.nirfRank ? `#${college.nirfRank}` : "N/A"}
            </Badge>
            {college.acreditation && (
              <Badge className="border-brand-green/20 bg-brand-green/10 text-brand-green font-bold">
                {college.acreditation}
              </Badge>
            )}
          </div>
        </div>

        {/* Data points summary */}
        <div className="mt-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-brand-border-light bg-brand-bg-soft/75 p-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">Avg Placement</div>
            <div className="mt-1 text-[20px] font-bold text-brand-blue leading-none">
              {college.placements && college.placements.length > 0 && college.placements[0]?.avgPackage ? `${college.placements[0].avgPackage} LPA` : "N/A"}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">Annual Fees</div>
            <div className="mt-1 text-[20px] font-bold text-brand-text-primary leading-none">
              {formatFees(college.annualFee)}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1">
              <Calendar className="h-3 w-3 text-brand-text-muted" />
              <span>Established</span>
            </div>
            <div className="mt-1 text-[18px] font-bold text-brand-text-primary leading-none">
              {college.established}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1">
              <Layers className="h-3 w-3 text-brand-text-muted" />
              <span>Type</span>
            </div>
            <div className="mt-1 text-[18px] font-bold text-brand-text-primary leading-none">
              {college.type}
            </div>
          </div>
        </div>

        {/* Interaction CTAs */}
        <div className="mt-auto flex items-center gap-3 md:justify-end">
          <Button
            variant="secondary"
            className="flex-1 md:flex-none md:w-[130px] h-9 text-[13px] font-semibold border-brand-border-light rounded-lg text-brand-text-primary"
            onClick={() => toggleShortlist(college.id)}
          >
            <Heart className={`mr-1.5 h-4.5 w-4.5 ${shortlisted ? "fill-brand-red text-brand-red" : "text-brand-text-muted"}`} />
            {shortlisted ? <span className="text-brand-red">Saved</span> : "Shortlist"}
          </Button>
          <Button
            variant="secondary"
            className="flex-1 md:flex-none md:w-[130px] h-9 text-[13px] font-semibold border-brand-border-light rounded-lg text-brand-text-primary"
            onClick={() => toggleCompare(college.id)}
          >
            {added ? <Check className="mr-1.5 h-4 w-4 text-brand-green" /> : null}
            {added ? <span className="text-brand-green">Added</span> : "Compare"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
