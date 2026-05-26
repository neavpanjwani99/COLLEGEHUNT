"use client";

import { useMemo, useState } from "react";
import type { College } from "@/types";
import { Badge, Button, Card } from "@/components/ui";

type ExamKey = "JEE" | "CUET" | "NEET" | "CAT" | "AILET" | "CLAT" | "SNAP" | "WBJEE" | "MET";
type Category = "General" | "OBC" | "SC" | "ST";

function percentileToRank(percentile: number): number {
  return Math.round(1000000 * (1 - percentile / 100));
}

export function AdmissionPredictor({ college }: { college: College }) {
  const [percentile, setPercentile] = useState("");
  const [exam, setExam] = useState<string>("");
  const [category, setCategory] = useState<Category>("General");
  const [result, setResult] = useState<null | { label: string; tone: "green" | "yellow" | "red"; fill: number; message: string }>(null);

  const availableExams = useMemo(() => Array.from(new Set(college.cutoffs.map((cutoff) => cutoff.exam))).slice(0, 4), [college.cutoffs]);
  const activeExam = exam || availableExams[0] || "";
  const check = () => {
    const p = Number(percentile);
    if (!Number.isFinite(p) || p < 0 || p > 100 || !activeExam) return;
    
    const cutoff = college.cutoffs.find((entry) => entry.exam === activeExam && entry.category === category);
    if (!cutoff) {
      setResult({ label: "No data", tone: "yellow", fill: 40, message: "No matching cutoff data found for this exam and category." });
      return;
    }

    const isPercentileBased = activeExam.toUpperCase().includes("CAT") || activeExam.toUpperCase().includes("CUET");

    if (isPercentileBased) {
      // For percentiles, higher is better
      if (p >= cutoff.cutoffValue) {
        setResult({ label: "High Chance", tone: "green", fill: 90, message: `Your percentile (${p}%) meets or exceeds the cutoff (${cutoff.cutoffValue}%).` });
      } else if (p >= cutoff.cutoffValue - 3) {
        setResult({ label: "Moderate Chance", tone: "yellow", fill: 60, message: `You are close to the cutoff (${cutoff.cutoffValue}%).` });
      } else {
        setResult({ label: "Low Chance", tone: "red", fill: 25, message: `Your percentile (${p}%) is below the cutoff (${cutoff.cutoffValue}%).` });
      }
    } else {
      // For ranks, lower is better. Percentile is converted to estimated rank.
      const rank = percentileToRank(p);
      if (rank <= cutoff.cutoffValue) {
        setResult({ label: "High Chance", tone: "green", fill: 90, message: `Estimated Rank: ~${rank.toLocaleString()} (Cutoff: ${cutoff.cutoffValue.toLocaleString()})` });
      } else if (rank <= cutoff.cutoffValue * 1.5) {
        setResult({ label: "Moderate Chance", tone: "yellow", fill: 60, message: `Estimated Rank: ~${rank.toLocaleString()} (Close to cutoff ${cutoff.cutoffValue.toLocaleString()})` });
      } else {
        setResult({ label: "Low Chance", tone: "red", fill: 25, message: `Estimated Rank: ~${rank.toLocaleString()} (Above cutoff ${cutoff.cutoffValue.toLocaleString()})` });
      }
    }
  };

  return (
    <Card className="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold text-[#222222]">Check your admission chances</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.04em] text-[#717171]">Your percentile</label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentile}
            onChange={(event) => setPercentile(event.target.value)}
            placeholder="Enter percentile (0-100)"
            className="mt-2 w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.04em] text-[#717171]">Exam</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableExams.map((value) => (
              <Badge key={value} className={`rounded-full px-3 py-1.5 border font-semibold transition-all ${activeExam === value ? "bg-[#FF385C] text-white border-transparent" : "bg-white border-gray-200 hover:border-gray-400"}`}>
                <button type="button" onClick={() => setExam(value)}>
                  {value}
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-[0.04em] text-[#717171]">Category</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["General", "OBC", "SC", "ST"] as Category[]).map((value) => (
            <Badge key={value} className={`rounded-full px-3 py-1.5 border font-semibold transition-all ${category === value ? "bg-[#FF385C] text-white border-transparent" : "bg-white border-gray-200 hover:border-gray-400"}`}>
              <button type="button" onClick={() => setCategory(value)}>
                {value}
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <Button className="mt-5 w-full rounded-full bg-[#FF385C] hover:bg-[#E61E4D] font-bold text-white border-none h-11" onClick={check}>
        Check Chances
      </Button>
      {result ? (
        <div className={`mt-5 rounded-2xl border p-4 ${result.tone === "green" ? "border-green-200 bg-green-50/50 text-green-800" : result.tone === "yellow" ? "border-yellow-200 bg-yellow-50/50 text-yellow-800" : "border-red-200 bg-red-50/50 text-red-800"}`}>
          <div className="flex items-center justify-between">
            <div className="font-bold">{result.label}</div>
            <div className="text-sm font-medium">{result.message}</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/80 overflow-hidden">
            <div className={`h-2 rounded-full ${result.tone === "green" ? "bg-green-500" : result.tone === "yellow" ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${result.fill}%` }} />
          </div>
        </div>
      ) : null}
    </Card>
  );
}
