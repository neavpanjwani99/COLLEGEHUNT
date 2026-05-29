"use client";

import { normalizeWeights, type WeightState } from "@/lib/scoring";
import { useRouter, useSearchParams } from "next/navigation";

interface WeightSlidersProps {
  weights: WeightState;
  setWeights: (weights: WeightState) => void;
}

export function WeightSliders({ weights, setWeights }: WeightSlidersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (key: keyof WeightState, value: number) => {
    const nextWeights = normalizeWeights(key, value, weights);
    setWeights(nextWeights);

    // Sync weight sliders with URL parameters for shareable links using the weights=p,f,l format
    const params = new URLSearchParams(searchParams);
    
    if (nextWeights.campusLife > 0) {
      params.set("weights", `${nextWeights.placement},${nextWeights.fees},${nextWeights.location},${nextWeights.campusLife}`);
    } else {
      params.set("weights", `${nextWeights.placement},${nextWeights.fees},${nextWeights.location}`);
    }
    
    // Clean up old parameters
    params.delete("placement");
    params.delete("fees");
    params.delete("location");
    params.delete("campusLife");

    router.replace(`/compare?${params.toString()}`, { scroll: false });
  };

  const resetWeights = () => {
    const defaultWeights = { placement: 50, fees: 30, location: 20, campusLife: 0 };
    setWeights(defaultWeights);

    const params = new URLSearchParams(searchParams);
    params.set("weights", `${defaultWeights.placement},${defaultWeights.fees},${defaultWeights.location}`);
    
    // Clean up old parameters
    params.delete("placement");
    params.delete("fees");
    params.delete("location");
    params.delete("campusLife");

    router.replace(`/compare?${params.toString()}`, { scroll: false });
  };

  const getLabel = (key: keyof WeightState) => {
    switch (key) {
      case "placement":
        return "Placement Outcome";
      case "fees":
        return "Tuition Fees (Low Fees)";
      case "location":
        return "Location Proximity";
      case "campusLife":
        return "Campus & Infrastructure";
      default:
        return key;
    }
  };

  const total = weights.placement + weights.fees + weights.location + weights.campusLife;

  return (
    <div className="w-full md:max-w-[320px] space-y-6 border-b md:border-b-0 md:border-r border-brand-border-light pb-8 md:pb-0 md:pr-8 bg-white no-print">
      <div>
        <h3 className="text-[18px] font-bold text-brand-text-primary">Decision Priority Weights</h3>
        <p className="text-[13px] text-brand-text-muted mt-1 leading-relaxed">
          Drag sliders to weight priorities. Match percentages and ranks update in the table live.
        </p>
      </div>

      <div className="space-y-4">
        {(["placement", "fees", "location", "campusLife"] as const)
          .filter((key) => key !== "campusLife" || weights.campusLife > 0)
          .map((key) => (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between text-[13px] font-bold text-brand-text-primary">
                <span>{getLabel(key)}</span>
                <span className="text-brand-blue">{weights[key]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={weights[key]}
                onChange={(e) => update(key, parseInt(e.target.value))}
                className="w-full h-1 bg-brand-border-light rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
            </div>
          ))}
      </div>

      <div className="flex justify-between items-center text-[13px] font-bold text-brand-text-primary pt-2 border-t border-brand-border-light">
        <span>Total Distribution</span>
        <span className={total === 100 ? "text-brand-green" : "text-brand-red"}>{total}%</span>
      </div>

      <button
        type="button"
        className="text-[13px] font-bold text-brand-red hover:text-brand-red-hover outline-none"
        onClick={resetWeights}
      >
        Reset Weights to Default
      </button>
    </div>
  );
}
