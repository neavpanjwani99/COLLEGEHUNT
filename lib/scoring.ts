import type { College } from "@/types";

export interface WeightState {
  placement: number;
  fees: number;
  location: number;
}

export function normalizeWeights(changedKey: keyof WeightState, newValue: number, current: WeightState): WeightState {
  const clamped = Math.max(0, Math.min(100, newValue));
  const restKeys = (["placement", "fees", "location"] as const).filter((key) => key !== changedKey);
  const restTotal = current[restKeys[0]] + current[restKeys[1]];
  const remaining = 100 - clamped;

  if (restTotal <= 0) {
    return restKeys[0] === "placement"
      ? { placement: 0, fees: 0, location: 0 }
      : { placement: 0, fees: 0, location: 0 };
  }

  const first = Math.round((current[restKeys[0]] / restTotal) * remaining);
  const second = remaining - first;
  return {
    ...current,
    [changedKey]: clamped,
    [restKeys[0]]: first,
    [restKeys[1]]: second,
  };
}

export function calculateScores(colleges: College[], weights: WeightState) {
  const packages = colleges.map((college) => college.placements[0]?.avgPackage ?? 0);
  const fees = colleges.map((college) => college.annualFee);
  const maxPackage = Math.max(...packages);
  const minPackage = Math.min(...packages);
  const maxFee = Math.max(...fees);
  const minFee = Math.min(...fees);

  return colleges.map((college) => {
    const placementValue = college.placements[0]?.avgPackage ?? 0;
    const feeValue = college.annualFee;
    const placementScore = maxPackage === minPackage ? 100 : ((placementValue - minPackage) / (maxPackage - minPackage)) * 100;
    const feesScore = maxFee === minFee ? 100 : ((maxFee - feeValue) / (maxFee - minFee)) * 100;
    const locationScore = 50;
    const finalScore = (placementScore * weights.placement + feesScore * weights.fees + locationScore * weights.location) / 100;

    return {
      college,
      placementScore,
      feesScore,
      locationScore,
      finalScore,
    };
  });
}
