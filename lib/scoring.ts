import type { College } from "@/types";

export interface WeightState {
  placement: number;
  fees: number;
  location: number;
  campusLife: number;
}

export function normalizeWeights(
  changedKey: keyof WeightState,
  newValue: number,
  current: WeightState
): WeightState {
  const clamped = Math.max(0, Math.min(100, newValue));
  
  // Find which other keys are active (have value > 0)
  const allKeys = ["placement", "fees", "location", "campusLife"] as const;
  const restKeys = allKeys.filter(
    (key) => key !== changedKey && (key !== "campusLife" || current.campusLife > 0)
  );

  const remaining = 100 - clamped;

  if (restKeys.length === 0) {
    return {
      ...current,
      [changedKey]: clamped,
    };
  }

  const restTotal = restKeys.reduce((sum, key) => sum + current[key], 0);

  if (restTotal <= 0) {
    const share = Math.floor(remaining / restKeys.length);
    const nextWeights = { ...current, [changedKey]: clamped };
    restKeys.forEach((key, idx) => {
      nextWeights[key] = idx === restKeys.length - 1 ? remaining - share * idx : share;
    });
    return nextWeights;
  }

  const nextWeights = { ...current, [changedKey]: clamped };
  let allocated = 0;
  restKeys.forEach((key, idx) => {
    if (idx === restKeys.length - 1) {
      nextWeights[key] = remaining - allocated;
    } else {
      const share = Math.round((current[key] / restTotal) * remaining);
      nextWeights[key] = share;
      allocated += share;
    }
  });

  return nextWeights;
}

export function calculateScores(colleges: College[], weights: WeightState) {
  const packages = colleges.map((college) => college.placements[0]?.avgPackage ?? 0);
  const fees = colleges.map((college) => college.annualFee);
  const maxPackage = Math.max(...packages, 1);
  const minPackage = Math.min(...packages, 0);
  const maxFee = Math.max(...fees, 1);
  const minFee = Math.min(...fees, 0);

  const totalWeight =
    (weights.placement || 0) +
    (weights.fees || 0) +
    (weights.location || 0) +
    (weights.campusLife || 0);

  const divisor = totalWeight || 1;

  return colleges.map((college) => {
    const placementValue = college.placements[0]?.avgPackage ?? 0;
    const feeValue = college.annualFee;

    const placementScore =
      maxPackage === minPackage
        ? 100
        : ((placementValue - minPackage) / (maxPackage - minPackage)) * 100;

    const feesScore =
      maxFee === minFee ? 100 : ((maxFee - feeValue) / (maxFee - minFee)) * 100;

    // Location score: government and central urban areas score higher
    const locationScore = college.type === "Government" ? 95 : 70;

    // Campus Life score based on tags or defaults
    const campusLifeScore =
      college.tags.includes("Campus Life") || college.tags.includes("Large Campus") ? 95 : 75;

    const finalScore =
      ((placementScore * (weights.placement || 0)) +
        (feesScore * (weights.fees || 0)) +
        (locationScore * (weights.location || 0)) +
        (campusLifeScore * (weights.campusLife || 0))) /
      divisor;

    return {
      college,
      placementScore,
      feesScore,
      locationScore,
      campusLifeScore,
      finalScore: Math.round(finalScore),
    };
  });
}
