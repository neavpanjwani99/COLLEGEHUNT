"use client";

import { useShortlist } from "@/context/ShortlistContext";
import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";

interface DetailHeroActionsProps {
  collegeId: string;
  websiteUrl: string;
}

export function DetailHeroActions({ collegeId, websiteUrl }: DetailHeroActionsProps) {
  const { isShortlisted, toggleShortlist } = useShortlist();
  const shortlisted = isShortlisted(collegeId);

  return (
    <div className="flex flex-col sm:flex-row gap-3 min-w-[220px]">
      <Button
        variant="secondary"
        onClick={() => toggleShortlist(collegeId)}
        className="w-full sm:flex-1 text-[14px] h-11 border-brand-border-light rounded-lg text-brand-text-primary hover:bg-brand-bg-soft font-bold flex items-center justify-center gap-1.5"
      >
        <Heart className={`h-4.5 w-4.5 ${shortlisted ? "fill-brand-red text-brand-red" : "text-brand-text-muted"}`} />
        {shortlisted ? "Saved" : "Save to Shortlist"}
      </Button>
      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1">
        <Button className="w-full text-[14px] h-11 bg-brand-red text-white hover:bg-brand-red-hover border-none font-bold rounded-lg flex items-center justify-center gap-1.5">
          Apply Now <ExternalLink className="h-4 w-4" />
        </Button>
      </a>
    </div>
  );
}
