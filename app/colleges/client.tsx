"use client";

import { useDeferredValue, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { College } from "@/types";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CollegeCard } from "@/components/CollegeCard";
import { CompareTray } from "@/components/CompareTray";
import { School, SlidersHorizontal, Search, ArrowUpDown, Sparkles } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { calculateScores } from "@/lib/scoring";

function ClientContent({ colleges }: { colleges: College[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Sync local search filters from URL
  const searchVal = searchParams.get("q") || "";
  const cityVal = searchParams.get("city") || "";
  const typeVal = searchParams.get("type") || "All";
  const feesMaxVal = searchParams.get("fees_max") ? parseInt(searchParams.get("fees_max") || "25") : 25;
  const sortVal = searchParams.get("sort") || ""; // default is NIRF or Onboarding score

  // Stream supports multiple values comma-separated or single
  const streamParam = searchParams.get("stream");
  const streamsVal = useMemo(() => {
    if (!streamParam) return [];
    return streamParam.split(",");
  }, [streamParam]);

  // Client search input (local debounced state)
  const [searchInput, setSearchInput] = useState(searchVal);
  const deferredSearch = useDeferredValue(searchInput);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [onboardedWeights, setOnboardedWeights] = useState<any>(null);

  // Sync client input with URL query param changes
  useEffect(() => {
    setSearchInput(searchParams.get("q") || "");
  }, [searchParams]);

  // Load onboarding weights on mount
  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 600); // Simulate network load
    const onboarded = window.localStorage.getItem("collegefind_onboarded");
    if (onboarded) {
      try {
        const parsed = JSON.parse(onboarded);
        if ((parsed.status === "completed" || parsed.status === "onboarded") && parsed.weights) {
          setOnboardedWeights(parsed.weights);
        }
      } catch (e) {}
    }
    return () => window.clearTimeout(timer);
  }, []);

  // Update URL function
  const updateUrl = (updatedParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updatedParams).forEach(([key, val]) => {
      if (val === null || val === "" || val === "All" || val === "undefined") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.replace(`/colleges?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    // Debounce to URL
    const timer = setTimeout(() => {
      updateUrl({ q: val || null });
    }, 300);
    return () => clearTimeout(timer);
  };

  const setCity = (c: string) => updateUrl({ city: c || null });
  const setType = (t: string) => updateUrl({ type: t || null });
  const setMaxFee = (f: number) => updateUrl({ fees_max: f.toString() });
  const setSort = (s: string) => updateUrl({ sort: s || null });

  const toggleStream = (stream: string) => {
    let nextStreams = [...streamsVal];
    if (nextStreams.includes(stream)) {
      nextStreams = nextStreams.filter((s) => s !== stream);
    } else {
      nextStreams.push(stream);
    }
    updateUrl({ stream: nextStreams.length > 0 ? nextStreams.join(",") : null });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    router.replace("/colleges", { scroll: false });
  };

  // Filter & Sort core logic
  const filteredAndSorted = useMemo(() => {
    // A. Filter logic
    let result = colleges.filter((college) => {
      // 1. Text Search matching name or city
      const matchesSearch =
        college.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        college.city.toLowerCase().includes(deferredSearch.toLowerCase());

      // 2. City filter
      const matchesCity = cityVal ? college.city.toLowerCase() === cityVal.toLowerCase() : true;

      // 3. Ownership Type
      const matchesType = typeVal === "All" ? true : college.type === typeVal;

      // 4. Multi-Stream matching
      const matchesStream =
        streamsVal.length === 0
          ? true
          : streamsVal.some((stream) =>
              college.streams.map((s) => s.toLowerCase()).includes(stream.toLowerCase())
            );

      // 5. Fees Max Limit (LPA to raw INR)
      // 25 LPA is "No Limit"
      const limitInInr = feesMaxVal * 100000;
      const matchesFees = feesMaxVal === 25 ? true : college.annualFee <= limitInInr;

      return matchesSearch && matchesCity && matchesType && matchesStream && matchesFees;
    });

    // B. Sort logic
    if (sortVal === "placement") {
      result.sort((a, b) => (b.placements[0]?.avgPackage || 0) - (a.placements[0]?.avgPackage || 0));
    } else if (sortVal === "fees") {
      result.sort((a, b) => a.annualFee - b.annualFee);
    } else if (sortVal === "nirf") {
      result.sort((a, b) => {
        const rankA = a.nirfRank || 99999;
        const rankB = b.nirfRank || 99999;
        return rankA - rankB;
      });
    } else {
      // DEFAULT SORT: If onboarding weights are completed, sort using composite score from calculateScores
      if (onboardedWeights) {
        const scoredColleges = calculateScores(result, {
          placement: onboardedWeights.placement || 0,
          fees: onboardedWeights.fees || 0,
          location: onboardedWeights.location || 0,
          campusLife: onboardedWeights.campusLife || 0,
        });
        scoredColleges.sort((a, b) => b.finalScore - a.finalScore);
        result = scoredColleges.map((item) => item.college);
      } else {
        // Fallback to NIRF default rank sort
        result.sort((a, b) => {
          const rankA = a.nirfRank || 99999;
          const rankB = b.nirfRank || 99999;
          return rankA - rankB;
        });
      }
    }

    return result;
  }, [colleges, deferredSearch, cityVal, typeVal, streamsVal, feesMaxVal, sortVal, onboardedWeights]);

  return (
    <>
      <div className="mx-auto max-w-[1360px] px-6 pt-6 pb-12 md:pt-10 md:pb-20">
        
        {/* Mobile controls */}
        <div className="mb-6 flex items-center justify-between md:hidden gap-3">
          <div className="text-sm font-bold text-brand-text-muted">
            {filteredAndSorted.length} Colleges Match
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="h-10 border-brand-border-light rounded-lg font-semibold text-[13px]"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4 text-brand-red" />
            Filters
          </Button>
        </div>

        {/* Desktop grid layout */}
        <div className="grid gap-8 md:grid-cols-[280px_minmax(0,1fr)] items-start">
          
          {/* Filter Panel (Left) */}
          <div className={`${showMobileFilters ? "block" : "hidden"} md:block md:sticky md:top-24 md:self-start`}>
            <FilterSidebar
              city={cityVal}
              setCity={setCity}
              maxFee={feesMaxVal}
              setMaxFee={setMaxFee}
              type={typeVal}
              setType={setType}
              streams={streamsVal}
              toggleStream={toggleStream}
              clear={clearAllFilters}
            />
          </div>

          {/* Listing and Search Context (Right) */}
          <div className="space-y-6">
            
            {/* Sort control only */}
            <div className="flex justify-end items-center bg-brand-bg-soft/50 p-4 border border-brand-border-light rounded-xl">
              {/* Sorting triggers */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <span className="text-[12px] font-bold text-brand-text-muted uppercase tracking-wider flex items-center gap-1 shrink-0">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sort By:
                </span>
                <select
                  value={sortVal}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 bg-white border border-brand-border-light rounded-lg px-3 text-[13px] font-bold text-brand-text-primary outline-none"
                >
                  <option value="">
                    {onboardedWeights ? "🎯 Recommended (Scores)" : "NIRF Rank (Default)"}
                  </option>
                  <option value="placement">Avg Package (High to Low)</option>
                  <option value="fees">Tuition Fees (Low to High)</option>
                  <option value="nirf">NIRF Rankings (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Recommendations Banner if Onboarded */}
            {onboardedWeights && !sortVal && (
              <div className="flex items-center justify-between border border-brand-green/20 bg-brand-green/5 px-4 py-3 rounded-lg text-brand-green text-[13px] font-bold">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Your priority weights are applied. Results sorted by AI recommendation score.
                </span>
                <button
                  onClick={() => router.push("/")}
                  className="text-[11px] uppercase tracking-wider bg-white border border-brand-green/20 px-2 py-1 rounded hover:bg-brand-green hover:text-white"
                >
                  Adjust Sliders
                </button>
              </div>
            )}

            {/* Main Cards Content */}
            {!loaded ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row overflow-hidden rounded-xl border border-brand-border-light bg-white"
                  >
                    {/* Left/Top Skeleton Banner */}
                    <div className="h-[160px] md:h-[220px] md:w-[260px] animate-pulse bg-gray-100 shrink-0" />
                    
                    {/* Content skeleton details */}
                    <div className="flex flex-1 flex-col p-6 space-y-4 justify-between">
                      <div className="space-y-2">
                        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                      </div>
                      
                      <div className="h-14 w-full animate-pulse rounded-xl bg-gray-100" />
                      
                      <div className="flex gap-3 justify-end pt-2">
                        <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-100" />
                        <div className="h-9 w-28 animate-pulse rounded-lg bg-gray-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-border-light py-24 bg-white text-center">
                <School className="mb-4 h-12 w-12 text-brand-red" />
                <h3 className="text-[20px] font-bold text-brand-text-primary">No colleges match your filters</h3>
                <p className="mt-2 text-[14px] text-brand-text-muted max-w-sm">
                  Try adjusting fees, streams, or ownership types to discover other choices.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 h-9 px-4 rounded-lg bg-brand-red text-white text-[13px] font-bold hover:bg-brand-red-hover"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredAndSorted.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Shortlist/Compare widgets */}
      <CompareTray />
    </>
  );
}

export default function CollegesClient({ colleges }: { colleges: College[] }) {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ClientContent colleges={colleges} />
      </Suspense>
    </div>
  );
}
