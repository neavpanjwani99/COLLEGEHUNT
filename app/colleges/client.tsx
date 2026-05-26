"use client";

import { useDeferredValue, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { College } from "@/types";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CollegeCard } from "@/components/CollegeCard";
import { CompareTray } from "@/components/CompareTray";
import { OnboardingModal } from "@/components/OnboardingModal";
import { School, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui";

function ClientContent({ colleges }: { colleges: College[] }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("q") || "";
  
  const [city, setCity] = useState("");
  const [type, setType] = useState("All");
  const [streams, setStreams] = useState<string[]>([]);
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return colleges.filter((college) => {
      const matchesSearch = college.name.toLowerCase().includes(deferredSearch.toLowerCase()) || college.city.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesCity = city ? college.city.toLowerCase().includes(city.toLowerCase()) : true;
      const matchesType = type === "All" ? true : college.type === type;
      const matchesStream = streams.length === 0 ? true : streams.some((stream) => college.streams.includes(stream));
      const matchesMin = minFee ? college.annualFee >= Number(minFee) : true;
      const matchesMax = maxFee ? college.annualFee <= Number(maxFee) : true;
      return matchesSearch && matchesCity && matchesType && matchesStream && matchesMin && matchesMax;
    });
  }, [colleges, deferredSearch, city, type, streams, minFee, maxFee]);

  const toggleStream = (stream: string) => setStreams((current) => (current.includes(stream) ? current.filter((item) => item !== stream) : [...current, stream]));

  return (
    <>
      <OnboardingModal />
      <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-20">
        <div className="mb-6 flex items-center justify-between md:hidden">
          <div className="text-sm font-medium text-[#6B7280]">{filtered.length} colleges found</div>
          <Button variant="secondary" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="grid gap-10 md:grid-cols-[260px_minmax(0,1fr)]">
          <div className={`${showMobileFilters ? "block" : "hidden"} md:block`}>
            <FilterSidebar city={city} setCity={setCity} minFee={minFee} setMinFee={setMinFee} maxFee={maxFee} setMaxFee={setMaxFee} type={type} setType={setType} streams={streams} toggleStream={toggleStream} clear={() => { setCity(""); setType("All"); setStreams([]); setMinFee(""); setMaxFee(""); }} />
          </div>
          <div>
            {!loaded ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
                    <div className="h-28 animate-pulse bg-gray-100" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-gray-100" />
                      <div className="mb-6 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                      <div className="mb-6 flex gap-2">
                        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                      </div>
                      <div className="h-16 w-full animate-pulse rounded bg-gray-100 mt-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E7EB] py-32 bg-[#F9FAFB]">
                <School className="mb-4 h-12 w-12 text-[#9CA3AF]" />
                <h3 className="text-xl font-semibold text-[#111827]">No colleges match your filters</h3>
                <p className="mt-2 text-[15px] text-[#6B7280]">Try adjusting your filters or clearing them to see results.</p>
                <button type="button" onClick={() => { setCity(""); setType("All"); setStreams([]); setMinFee(""); setMaxFee(""); }} className="mt-6 font-semibold text-[#006AFF] hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((college) => <CollegeCard key={college.id} college={college} />)}
              </div>
            )}
          </div>
        </div>
      </div>
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
