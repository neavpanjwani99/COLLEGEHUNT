"use client";

import { useMemo, useState } from "react";
import { X, Share2 } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { colleges } from "@/data/colleges";
import { calculateScores, type WeightState } from "@/lib/scoring";
import { formatFees, formatPackage } from "@/lib/utils";
import { useCompare } from "@/context/CompareContext";

export function CompareTable({ weights }: { weights: WeightState }) {
  const { compareIds, removeCompare } = useCompare();
  const [copied, setCopied] = useState(false);
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

  return (
    <div className="flex-1">
      <div className="mb-4 flex justify-end">
        <Button variant="secondary" onClick={copyUrl}>
          <Share2 className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Share this comparison"}
        </Button>
      </div>
      <div className="overflow-x-auto border border-[#E5E7EB]">
        <table className="w-full text-left text-sm">
          <thead className="bg-white">
            <tr>
              <th className="w-40 border-b border-[#E5E7EB] p-4">Criteria</th>
              {scored.map(({ college }) => (
                <th key={college.id} className="border-b border-[#E5E7EB] p-4 align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold">{college.name}</div>
                      <div className="text-xs text-[#6B7280]">{college.city}</div>
                    </div>
                    <button type="button" onClick={() => removeCompare(college.id)}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 text-3xl font-bold">{Math.round((scored.find((row) => row.college.id === college.id)?.finalScore ?? 0))}<span className="text-sm text-[#6B7280]">/100</span></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="border-b border-[#E5E7EB] p-4 font-medium">{row.label}</td>
                {selected.map((college) => (
                  <td key={college.id} className="border-b border-[#E5E7EB] p-4">
                    {row.label === "Type" ? <Badge>{row.formatter(college)}</Badge> : row.formatter(college)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
