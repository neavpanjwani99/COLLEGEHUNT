"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui";
import { colleges } from "@/data/colleges";
import { useCompare } from "@/context/CompareContext";
import { WeightSliders } from "@/components/WeightSliders";
import { CompareTable } from "@/components/CompareTable";
import type { WeightState } from "@/lib/scoring";

export default function CompareClient() {
  const { compareIds } = useCompare();
  const searchParams = useSearchParams();

  // Initialize with standard weights Placement: 50%, Fees: 30%, Location: 20%
  const [weights, setWeights] = useState<WeightState>({
    placement: 50,
    fees: 30,
    location: 20,
    campusLife: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse ids from URL search parameters, fallback to compareIds state
  const selectedIds = useMemo(() => {
    const idsParam = searchParams.get("ids");
    if (idsParam) {
      return idsParam.split(",");
    }
    // Backward compatibility with legacy "colleges" param
    const collegesParam = searchParams.get("colleges");
    if (collegesParam) {
      const slugs = collegesParam.split(",");
      return colleges.filter((c) => slugs.includes(c.slug)).map((c) => c.id);
    }
    return compareIds;
  }, [searchParams, compareIds]);

  const selected = useMemo(() => {
    return colleges.filter((college) => selectedIds.includes(college.id));
  }, [selectedIds]);

  // Parse weights from URL search parameters on mount or when searchParams change
  useEffect(() => {
    const weightsParam = searchParams.get("weights");
    if (weightsParam) {
      const parts = weightsParam.split(",").map(Number);
      if (parts.length >= 3 && parts.every(Number.isFinite)) {
        setWeights({
          placement: parts[0],
          fees: parts[1],
          location: parts[2],
          campusLife: parts[3] || 0,
        });
        return;
      }
    }

    // Fallback to legacy individual parameters
    const p = searchParams.get("placement");
    const f = searchParams.get("fees");
    const l = searchParams.get("location");
    const c = searchParams.get("campusLife");

    if (p !== null && f !== null && l !== null) {
      const placement = Number(p);
      const fees = Number(f);
      const location = Number(l);
      const campusLife = c !== null ? Number(c) : 0;

      if ([placement, fees, location, campusLife].every((value) => Number.isFinite(value))) {
        setWeights({ placement, fees, location, campusLife });
      }
    }
  }, [searchParams]);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  if (selected.length < 2) {
    return (
      <div className="min-h-screen bg-white px-6 pt-10 pb-20">
        <div className="mx-auto max-w-[1360px]">
          <h1 className="text-[32px] font-bold tracking-tight text-brand-text-primary">Compare Colleges</h1>
          <p className="mt-1 text-[14px] text-brand-text-muted font-bold">
            Weigh criteria weights to find the best match based on your preferences.
          </p>

          <div className="mt-12 max-w-[500px] mx-auto border border-brand-border-light rounded-xl bg-white p-12 text-center shadow-card flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-brand-red-tint text-brand-red rounded-full flex items-center justify-center mb-6">
              <Scale className="h-7 w-7" />
            </div>
            <h3 className="text-[18px] font-bold text-brand-text-primary">Select Colleges to Compare</h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-brand-text-body font-medium">
              Choose at least 2 colleges from the directory to compute placement package deltas, fee score normalization, and ranking comparisons.
            </p>
            <Link href="/colleges" className="mt-6">
              <Button className="rounded-lg bg-brand-red hover:bg-brand-red-hover font-bold text-white px-6 py-2.5 h-11 border-none transition-colors">
                Browse Colleges Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 pt-10 pb-20">
      <div className="mx-auto max-w-[1360px]">
        <h1 className="text-[32px] font-bold tracking-tight text-brand-text-primary">Compare Colleges</h1>
        <p className="mt-1 text-[14px] text-brand-text-muted font-bold">
          Weigh criteria weights to find the best match based on your preferences.
        </p>
        <div className="mt-10 flex flex-col gap-8 md:flex-row items-start">
          <WeightSliders weights={weights} setWeights={setWeights} />
          <CompareTable weights={weights} selected={selected} />
        </div>
      </div>
    </div>
  );
}
