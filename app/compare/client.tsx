"use client"; // file is for client side as yeh states and effects use kar raha hai

import { useEffect, useState } from "react";
import { colleges } from "@/data/colleges";
import { useCompare } from "@/context/CompareContext";
import { WeightSliders } from "@/components/WeightSliders";
import { CompareTable } from "@/components/CompareTable";
import type { WeightState } from "@/lib/scoring";

export default function CompareClient() {
  const { compareIds } = useCompare();
  const [weights, setWeights] = useState<WeightState>({ placement: 60, fees: 30, location: 10 });
  const selected = colleges.filter((college) => compareIds.includes(college.id));
  
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

  if (selected.length < 2) {
    return <div className="flex min-h-screen items-center justify-center p-10 text-[#374151]">Add at least 2 colleges to compare</div>;
  }

  return (
    <div className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="text-4xl font-bold">Compare colleges</h1>
        <p className="mt-2 text-[#6B7280]">Adjust what matters most to see your best match</p>
        <div className="mt-10 flex flex-col gap-8 md:flex-row">
          <WeightSliders weights={weights} setWeights={setWeights} />
          <CompareTable weights={weights} />
        </div>
      </div>
    </div>
  );
}
