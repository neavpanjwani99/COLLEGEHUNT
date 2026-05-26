"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { normalizeWeights, type WeightState } from "@/lib/scoring";

export function WeightSliders({ weights, setWeights }: { weights: WeightState; setWeights: (weights: WeightState) => void }) {
  const update = (key: keyof WeightState, value: number) => setWeights(normalizeWeights(key, value, weights));

  return (
    <div className="w-full md:max-w-[320px] space-y-5 border-b md:border-b-0 md:border-r border-[#E5E7EB] pb-8 md:pb-0 md:pr-8">
      <h3 className="text-[18px] font-semibold">What matters to you</h3>
      <p className="text-sm text-[#6B7280]">Drag sliders to weight your priorities. Scores update live.</p>
      {(["placement", "fees", "location"] as const).map((key) => (
        <div key={key}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="capitalize">{key === "fees" ? "Fees (lower is better)" : key === "location" ? "Location match" : "Placement"}</span>
            <span className="font-semibold text-[#006AFF]">{weights[key]}%</span>
          </div>
          <input type="range" min="0" max="100" step="5" value={weights[key]} onChange={(event) => update(key, Number(event.target.value))} className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#006AFF]" />
        </div>
      ))}
      <div className="text-sm font-medium text-[#111827]">Total: 100%</div>
      <button type="button" className="text-sm font-semibold text-[#006AFF] hover:underline" onClick={() => setWeights({ placement: 60, fees: 30, location: 10 })}>
        Reset weights
      </button>
    </div>
  );
}
