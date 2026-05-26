"use client";

import { useMemo, useState, useEffect } from "react";
import { X, Share2, Award } from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { colleges } from "@/data/colleges";
import { calculateScores, type WeightState } from "@/lib/scoring";
import { formatFees, formatPackage } from "@/lib/utils";
import { useCompare } from "@/context/CompareContext";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

export function CompareTable({ weights }: { weights: WeightState }) {
  const { compareIds, removeCompare } = useCompare();
  const [copied, setCopied] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = colleges.filter((college) => compareIds.includes(college.id));
  const scored = useMemo(() => calculateScores(selected, weights).sort((a, b) => b.finalScore - a.finalScore), [selected, weights]);

  const copyUrl = async () => {
    const params = new URLSearchParams();
    params.set("colleges", selected.map((college) => college.slug).join(","));
    params.set("placement", String(weights.placement));
    params.set("fees", String(weights.fees));
    params.set("location", String(weights.location));
    await navigator.clipboard.writeText(`${window.location.origin}/compare?${params.toString()}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const getWinningValue = (rowLabel: string) => {
    if (selected.length < 2) return null;
    const values = selected.map((c) => {
      if (rowLabel === "NIRF Rank") return c.nirfRank;
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
    
    if (rowLabel === "NIRF Rank") return college.nirfRank === winVal;
    if (rowLabel === "Annual Fees") return college.annualFee === winVal;
    if (rowLabel === "Avg Package") return (college.placements[0]?.avgPackage ?? 0) === winVal;
    if (rowLabel === "Max Package") return (college.placements[0]?.maxPackage ?? 0) === winVal;
    if (rowLabel === "Placement Rate") return (college.placements[0]?.placementRate ?? 0) === winVal;
    
    return false;
  };

  if (selected.length < 2) return <div className="flex items-center justify-center p-10 text-[#6B7280]">Add at least 2 colleges to compare</div>;

  const rows: Array<{
    label: string;
    formatter: (college: (typeof selected)[number]) => string;
  }> = [
    { label: "NIRF Rank", formatter: (college) => String(college.nirfRank) },
    { label: "Annual Fees", formatter: (college) => formatFees(college.annualFee) },
    { label: "Avg Package", formatter: (college) => formatPackage(college.placements[0]?.avgPackage ?? 0) },
    { label: "Max Package", formatter: (college) => formatPackage(college.placements[0]?.maxPackage ?? 0) },
    { label: "Placement Rate", formatter: (college) => `${college.placements[0]?.placementRate ?? 0}%` },
    { label: "Streams offered", formatter: (college) => college.streams.join(", ") },
    { label: "Accreditation", formatter: (college) => college.acreditation },
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
    { subject: "NIRF Rank", ...scored.reduce((acc, { college }) => ({ ...acc, [college.name]: Math.max(10, 100 - college.nirfRank * 3) }), {}) },
    { subject: "Placement Rate", ...scored.reduce((acc, { college }) => ({ ...acc, [college.name]: college.placements[0]?.placementRate ?? 0 }), {}) },
    { subject: "Courses Offered", ...scored.reduce((acc, { college }) => ({ ...acc, [college.name]: Math.min(100, college.courses.length * 20 + 20) }), {}) }
  ];

  const chartColors = ["#FF385C", "#10B981", "#F59E0B"];

  return (
    <div className="flex-1 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="diff-only"
            checked={diffOnly}
            onChange={(e) => setDiffOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C] cursor-pointer"
          />
          <label htmlFor="diff-only" className="text-sm font-semibold text-[#717171] select-none cursor-pointer">
            Highlight differences only
          </label>
        </div>
        <Button variant="secondary" onClick={copyUrl} className="h-10 text-sm font-semibold">
          <Share2 className="mr-2 h-4 w-4" />
          {copied ? "Copied Link!" : "Share comparison"}
        </Button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50/70">
              <th className="w-40 border-b border-gray-200 p-4 text-[12px] font-bold uppercase tracking-wider text-[#717171]">Criteria</th>
              {scored.map(({ college }) => (
                <th key={college.id} className="border-b border-gray-200 p-4 align-top min-w-[200px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-[#222222]">{college.name}</div>
                      <div className="text-xs text-[#717171]">{college.city}</div>
                    </div>
                    <button type="button" onClick={() => removeCompare(college.id)} className="text-[#717171] hover:text-[#222222] hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#222222]">
                      {Math.round(scored.find((row) => row.college.id === college.id)?.finalScore ?? 0)}
                    </span>
                    <span className="text-xs font-semibold text-[#717171]">/100</span>
                    {scored[0]?.college.id === college.id && (
                      <Badge className="ml-2 bg-[#E6F7F0] text-[#008A5E] border-none font-bold uppercase text-[9px] px-2 py-0.5 rounded-full">Best Match</Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.label} className="hover:bg-gray-50/50">
                <td className="border-b border-gray-100 p-4 font-semibold text-[#222222] bg-gray-50/10">{row.label}</td>
                {scored.map(({ college }) => {
                  const highlight = isWinner(row.label, college);
                  return (
                    <td key={college.id} className={`border-b border-gray-100 p-4 text-[#222222] transition-colors ${highlight ? "bg-[#E6F7F0]/30 text-[#008A5E] font-semibold" : ""}`}>
                      <div className="flex items-center gap-2">
                        {row.label === "Type" ? <Badge className="bg-[#F3F4F6] text-[#4B5563] border-none font-semibold rounded-full">{row.formatter(college)}</Badge> : row.formatter(college)}
                        {highlight && (
                          <span className="inline-flex items-center gap-1 rounded bg-[#E6F7F0] px-2 py-0.5 text-[9px] font-bold text-[#008A5E] uppercase tracking-wider rounded-full">
                            <Award className="h-3.5 w-3.5" /> Winner
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Radar Chart Section */}
      <Card className="p-6 rounded-2xl border-gray-200">
        <h3 className="text-lg font-bold text-[#222222] mb-2">Comparison Overview</h3>
        <p className="text-sm text-[#717171] mb-6">Visual analysis of colleges across key academic, financial, and placement dimensions.</p>
        <div className="h-[320px] w-full flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#4B5563", fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#9CA3AF" }} />
                {scored.map(({ college }, idx) => (
                  <Radar
                    key={college.id}
                    name={college.name}
                    dataKey={college.name}
                    stroke={chartColors[idx % chartColors.length]}
                    fill={chartColors[idx % chartColors.length]}
                    fillOpacity={0.15}
                  />
                ))}
                <Legend wrapperStyle={{ paddingTop: "15px" }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-gray-50 animate-pulse rounded" />
          )}
        </div>
      </Card>
    </div>
  );
}
