"use client"; // file is for client side as yeh states and effects use kar raha hai

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui";
import { colleges } from "@/data/colleges";
import { useCompare } from "@/context/CompareContext";
import { WeightSliders } from "@/components/WeightSliders";
import { CompareTable } from "@/components/CompareTable";
import type { WeightState } from "@/lib/scoring";

export default function CompareClient() {
  const { compareIds } = useCompare();
  const [weights, setWeights] = useState<WeightState>({ placement: 60, fees: 30, location: 10 });
  const selected = colleges.filter((college) => compareIds.includes(college.id));
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
// hooks to read weights from URL query parameters, so that users can share their comparisons with custom weights by sharing the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("placement");
    const f = params.get("fees");
    const l = params.get("location");
    if (p !== null && f !== null && l !== null) {
      const placement = Number(p);
      const fees = Number(f);
      const location = Number(l);
      if ([placement, fees, location].every((value) => Number.isFinite(value))) {
        setWeights({ placement, fees, location });
      }
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  if (selected.length < 2) {
    return (
      <div className="min-h-screen bg-white px-6 pt-10 pb-20">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-4xl font-bold tracking-tight text-[#222222]">Compare colleges</h1>
          <p className="mt-2 text-[#717171] font-medium">Adjust what matters most to see your best match</p>
          
          <div className="mt-12 max-w-[500px] mx-auto border border-gray-200 rounded-2xl bg-white p-12 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#FFF0F2] text-[#FF385C] rounded-full flex items-center justify-center mb-6">
              <Scale className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[#222222]">Select colleges to compare</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#717171] font-medium">
              Choose at least 2 colleges from the directory to compare their placements, fees, NIRF rankings, and location scores.
            </p>
            <Link href="/colleges" className="mt-6">
              <Button className="rounded-full bg-[#FF385C] hover:bg-[#E61E4D] font-bold text-white px-6 py-2.5 h-11 border-none shadow-sm transition-all">
                Browse Colleges
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 pt-10 pb-20">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="text-4xl font-bold tracking-tight text-[#222222]">Compare colleges</h1>
        <p className="mt-2 text-[#717171] font-medium">Adjust what matters most to see your best match</p>
        <div className="mt-10 flex flex-col gap-8 md:flex-row">
          <WeightSliders weights={weights} setWeights={setWeights} />
          <CompareTable weights={weights} />
        </div>
      </div>
    </div>
  );
}
