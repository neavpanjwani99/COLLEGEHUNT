// added highlight differences styling in compare table
"use client";

import { useMemo, useState, useEffect } from "react";
import { X, Share2, Award, Info, Scale, Printer } from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { colleges } from "@/data/colleges";
import { calculateScores, type WeightState } from "@/lib/scoring";
import { formatFees, formatPackage } from "@/lib/utils";
import { useShortlist } from "@/context/ShortlistContext";
import type { College } from "@/types";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

export function CompareTable({ weights, selected }: { weights: WeightState; selected: College[] }) {
  const { toggleShortlist } = useShortlist();
  const [copied, setCopied] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute scores using the 4 weight criteria
  const scored = useMemo(() => {
    return calculateScores(selected, weights).sort((a, b) => b.finalScore - a.finalScore);
  }, [selected, weights]);

  // Compute minimum avg package and max package to show placement deltas
  const placementDeltas = useMemo(() => {
    if (selected.length < 2) return null;
    const avgPackages = selected.map((c) => c.placements[0]?.avgPackage ?? 0);
    const maxPackages = selected.map((c) => c.placements[0]?.maxPackage ?? 0);
    const minAvg = Math.min(...avgPackages);
    const minMax = Math.min(...maxPackages);
    return { minAvg, minMax };
  }, [selected]);

  const copyUrl = async () => {
    const params = new URLSearchParams();
    params.set("ids", selected.map((c) => c.id).join(","));
    params.set("weights", `${weights.placement},${weights.fees},${weights.location}`);
    
    await navigator.clipboard.writeText(`${window.location.origin}/compare?${params.toString()}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const getWinningValue = (rowLabel: string) => {
    if (selected.length < 2) return null;
    const values = selected.map((c) => {
      if (rowLabel === "NIRF Rank") return c.nirfRank || 9999;
      if (rowLabel === "Annual Fees") return c.annualFee;
      if (rowLabel === "Avg Package") return c.placements[0]?.avgPackage ?? 0;
      if (rowLabel === "Max Package") return c.placements[0]?.maxPackage ?? 0;
      if (rowLabel === "Placement Rate") return c.placements[0]?.placementRate ?? 0;
      return null;
    }).filter((v) => v !== null) as number[];
    
    if (values.length === 0) return null;
    if (rowLabel === "NIRF Rank" || rowLabel === "Annual Fees") {
      return Math.min(...values); // Lower rank/fees is better
    } else {
      return Math.max(...values); // Higher packages/rates are better
    }
  };

  const isWinner = (rowLabel: string, college: typeof selected[number]) => {
    const winVal = getWinningValue(rowLabel);
    if (winVal === null) return false;
    
    if (rowLabel === "NIRF Rank") return (college.nirfRank || 9999) === winVal;
    if (rowLabel === "Annual Fees") return college.annualFee === winVal;
    if (rowLabel === "Avg Package") return (college.placements[0]?.avgPackage ?? 0) === winVal;
    if (rowLabel === "Max Package") return (college.placements[0]?.maxPackage ?? 0) === winVal;
    if (rowLabel === "Placement Rate") return (college.placements[0]?.placementRate ?? 0) === winVal;
    
    return false;
  };

  const rows: Array<{
    label: string;
    formatter: (college: (typeof selected)[number]) => string;
  }> = [
    { label: "NIRF Rank", formatter: (college) => college.nirfRank ? `#${college.nirfRank}` : "N/A" },
    { label: "Annual Fees", formatter: (college) => formatFees(college.annualFee) },
    { label: "Avg Package", formatter: (college) => college.placements && college.placements.length > 0 && college.placements[0]?.avgPackage ? formatPackage(college.placements[0].avgPackage) : "N/A" },
    { label: "Max Package", formatter: (college) => college.placements && college.placements.length > 0 && college.placements[0]?.maxPackage ? formatPackage(college.placements[0].maxPackage) : "N/A" },
    { label: "Placement Rate", formatter: (college) => college.placements && college.placements.length > 0 && college.placements[0]?.placementRate ? `${college.placements[0].placementRate}%` : "N/A" },
    { label: "Streams offered", formatter: (college) => college.streams.join(", ") },
    { label: "Accreditation", formatter: (college) => college.acreditation || "N/A" },
    { label: "City", formatter: (college) => college.city },
    { label: "Type", formatter: (college) => college.type },
  ];

  const isRowSimilar = (row: typeof rows[number]) => {
    if (selected.length < 2) return true;
    const firstVal = row.formatter(selected[0]);
    return selected.every((college) => row.formatter(college) === firstVal);
  };

  const visibleRows = diffOnly ? rows.filter((r) => !isRowSimilar(r)) : rows;

  // Radar Dimensions (Normalized 10-100)
  const radarData = [
    { subject: "Avg Package", ...scored.reduce((acc, { college }) => ({ ...acc, [college.name]: Math.min(100, Math.round((college.placements[0]?.avgPackage ?? 0) * 2.5)) }), {}) },
    { subject: "Fees Value", ...scored.reduce((acc, { college }) => ({ ...acc, [college.name]: Math.round(Math.max(5, (1 - college.annualFee / 3000000) * 100)) }), {}) },
    { subject: "NIRF Rank", ...scored.reduce((acc, { college }) => ({ ...acc, [college.name]: Math.max(10, 100 - (college.nirfRank || 99) * 3) }), {}) },
    { subject: "Placement Rate", ...scored.reduce((acc, { college }) => ({ ...acc, [college.name]: college.placements[0]?.placementRate ?? 0 }), {}) },
    { subject: "Campus Life", ...scored.reduce((acc, { college }) => ({ ...acc, [college.name]: college.tags.includes("Campus Life") ? 95 : 70 }), {}) }
  ];

  const chartColors = ["#006AFF", "#FF385C", "#008A05"];

  if (selected.length < 2) {
    return <div className="flex items-center justify-center p-10 text-brand-text-muted">Add at least 2 colleges to compare</div>;
  }

  return (
    <div className="flex-1 space-y-8 bg-white print-container">
      <style>{`
        @media print {
          header, footer, aside, .no-print, button, .recharts-legend-wrapper {
            display: none !important;
          }
          .min-h-screen, .px-6, .pt-10, .pb-20 {
            padding: 0 !important;
            margin: 0 !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="diff-only"
            checked={diffOnly}
            onChange={(e) => setDiffOnly(e.target.checked)}
            className="h-4 w-4 rounded border-brand-border-light text-brand-red focus:ring-brand-red cursor-pointer"
          />
          <label htmlFor="diff-only" className="text-sm font-bold text-brand-text-muted select-none cursor-pointer">
            Highlight differences only
          </label>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={copyUrl}
            className="h-10 text-[13px] font-bold border-brand-border-light text-brand-text-primary rounded-lg animate-none"
          >
            <Share2 className="mr-1.5 h-4 w-4 text-brand-red" />
            {copied ? "Copied Link!" : "Share URL"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.print()}
            className="h-10 text-[13px] font-bold border-brand-border-light text-brand-text-primary rounded-lg animate-none"
          >
            <Printer className="mr-1.5 h-4 w-4 text-brand-red" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-brand-border-light rounded-xl bg-white shadow-card">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-brand-bg-soft">
              <th className="w-44 border-b border-brand-border-light p-4 text-[11px] font-bold uppercase tracking-wider text-brand-text-muted">
                Comparison Fields
              </th>
              {scored.map(({ college, placementScore, feesScore, locationScore, campusLifeScore, finalScore }) => {
                const totalWeight = weights.placement + weights.fees + weights.location + weights.campusLife || 1;
                
                // Detailed contribution breakdown
                const placementContribution = Math.round((placementScore * weights.placement) / totalWeight);
                const feesContribution = Math.round((feesScore * weights.fees) / totalWeight);
                const locationContribution = Math.round((locationScore * weights.location) / totalWeight);
                const campusContribution = Math.round((campusLifeScore * weights.campusLife) / totalWeight);

                return (
                  <th key={college.id} className="border-b border-brand-border-light p-4 align-top min-w-[220px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-brand-text-primary text-[15px]">{college.name}</div>
                        <div className="text-[12px] text-brand-text-muted mt-0.5">{college.city}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleShortlist(college.id)}
                        className="text-brand-text-muted hover:text-brand-text-primary p-1 rounded hover:bg-white no-print"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Score display & Breakdown details */}
                    <div className="mt-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-brand-text-primary">
                          {finalScore}
                        </span>
                        <span className="text-xs font-bold text-brand-text-muted">/100 Match</span>
                        {scored[0]?.college.id === college.id && (
                          <Badge className="ml-2 bg-brand-green/10 text-brand-green border-transparent font-bold uppercase text-[9px] px-2 py-0.5 rounded">
                            Best Choice
                          </Badge>
                        )}
                      </div>
                      
                      {/* Score breakdown equation */}
                      <div className="mt-2.5 bg-white border border-brand-border-light rounded-lg p-2.5 space-y-1 text-[11px] text-brand-text-body font-semibold">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted mb-1 border-b border-brand-border-light pb-1">
                          Score Breakdown
                        </div>
                        <div className="flex justify-between">
                          <span>Placement ({weights.placement}% weight)</span>
                          <span className="font-bold text-brand-blue">+{placementContribution} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tuition Fees ({weights.fees}% weight)</span>
                          <span className="font-bold text-brand-blue">+{feesContribution} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location ({weights.location}% weight)</span>
                          <span className="font-bold text-brand-blue">+{locationContribution} pts</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Campus Life ({weights.campusLife}% weight)</span>
                          <span className="font-bold text-brand-blue">+{campusContribution} pts</span>
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border-light">
            {visibleRows.map((row) => (
              <tr key={row.label} className="hover:bg-brand-bg-soft/20">
                <td className="p-4 font-bold text-brand-text-primary text-[13px] bg-brand-bg-soft/40 w-44">
                  {row.label}
                </td>
                {scored.map(({ college }) => {
                  const highlight = isWinner(row.label, college);
                  return (
                    <td
                      key={college.id}
                      className={`p-4 text-[13px] text-brand-text-body font-medium transition-colors ${
                        highlight ? "bg-brand-green/5 text-brand-green font-bold" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {row.label === "Type" ? (
                          <Badge className="bg-brand-blue-tint text-brand-blue border-transparent font-bold text-[11px] rounded">
                            {row.formatter(college)}
                          </Badge>
                        ) : (
                          row.formatter(college)
                        )}
                        {highlight && (
                          <span className="inline-flex items-center gap-1 bg-brand-green/10 px-2 py-0.5 text-[9px] font-bold text-brand-green uppercase tracking-wider rounded">
                            <Award className="h-3 w-3" /> Winner
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* PLACEMENT PACKAGE DELTA ROWS */}
            {placementDeltas && (
              <>
                <tr className="bg-brand-bg-soft/10">
                  <td className="p-4 font-bold text-brand-text-primary text-[13px] bg-brand-bg-soft/40 w-44">
                    Avg Package Delta
                  </td>
                  {scored.map(({ college }) => {
                    const avg = college.placements[0]?.avgPackage ?? 0;
                    const delta = avg - placementDeltas.minAvg;
                    const isLowest = avg === placementDeltas.minAvg;

                    return (
                      <td key={college.id} className="p-4 text-[13px] font-bold text-brand-text-primary">
                        {isLowest ? (
                          <span className="text-brand-text-muted">Baseline (Lowest)</span>
                        ) : (
                          <span className="text-brand-green">+{delta.toFixed(1)} LPA Package Advantage</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr className="bg-brand-bg-soft/10">
                  <td className="p-4 font-bold text-brand-text-primary text-[13px] bg-brand-bg-soft/40 w-44 font-bold">
                    Max Package Delta
                  </td>
                  {scored.map(({ college }) => {
                    const max = college.placements[0]?.maxPackage ?? 0;
                    const delta = max - placementDeltas.minMax;
                    const isLowest = max === placementDeltas.minMax;

                    return (
                      <td key={college.id} className="p-4 text-[13px] font-bold text-brand-text-primary">
                        {isLowest ? (
                          <span className="text-brand-text-muted">Baseline (Lowest)</span>
                        ) : (
                          <span className="text-brand-green">+{delta.toFixed(1)} LPA Peak Advantage</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Radar Chart Section */}
      <Card className="p-6 rounded-xl border-brand-border-light shadow-card bg-white">
        <div className="mb-6">
          <h3 className="text-[16px] font-bold text-brand-text-primary">Comparison Overview Chart</h3>
          <p className="text-[13px] text-brand-text-muted mt-1 leading-relaxed">
            Visual dimension analysis of colleges across key academic, financial, and placement metrics.
          </p>
        </div>
        <div className="h-[320px] w-full flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#484848", fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#717171" }} />
                {scored.map(({ college }, idx) => (
                  <Radar
                    key={college.id}
                    name={college.name}
                    dataKey={college.name}
                    stroke={chartColors[idx % chartColors.length]}
                    fill={chartColors[idx % chartColors.length]}
                    fillOpacity={0.12}
                  />
                ))}
                <Legend wrapperStyle={{ paddingTop: "15px" }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-brand-bg-soft animate-pulse rounded-lg" />
          )}
        </div>
      </Card>
    </div>
  );
}
