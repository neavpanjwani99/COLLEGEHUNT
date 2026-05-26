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
  const [exam, setExam] = useState<ExamKey>("JEE");
  const [category, setCategory] = useState<Category>("General");
  const [result, setResult] = useState<null | { label: string; tone: "green" | "yellow" | "red"; fill: number; message: string }>(null);

  const availableExams = useMemo(() => Array.from(new Set(college.cutoffs.map((cutoff) => cutoff.exam))).slice(0, 4), [college.cutoffs]);

  const check = () => {
    const p = Number(percentile);
    if (!Number.isFinite(p)) return;
    const rank = percentileToRank(p);
    const cutoff = college.cutoffs.find((entry) => entry.exam === exam && entry.category === category);
    if (!cutoff) {
      setResult({ label: "No data", tone: "yellow", fill: 40, message: "No matching cutoff data found for this exam and category." });
      return;
    }
    if (rank <= cutoff.cutoffValue) {
      setResult({ label: "High Chance", tone: "green", fill: 90, message: "Your rank is within cutoff range." });
      return;
    }
    if (rank <= cutoff.cutoffValue * 1.2) {
      setResult({ label: "Moderate Chance", tone: "yellow", fill: 60, message: "You are close to the cutoff." });
      return;
    }
    setResult({ label: "Low Chance", tone: "red", fill: 25, message: "Your rank is above the cutoff." });
  };

  return (
    <Card className="border-[#BFDBFE] bg-[#EFF6FF] p-6">
      <h3 className="text-lg font-semibold">Check your admission chances</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.04em] text-[#6B7280]">Your JEE/CUET Percentile</label>
          <input
            type="number"
            min="0"
            max="100"
            value={percentile}
            onChange={(event) => setPercentile(event.target.value)}
            placeholder="Enter percentile (0-100)"
            className="mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.04em] text-[#6B7280]">Exam</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {availableExams.map((value) => (
              <Badge key={value} className={exam === value ? "bg-[#006AFF] text-white" : "bg-white"}>
                <button type="button" onClick={() => setExam(value as ExamKey)}>
                  {value}
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#6B7280]">Category</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["General", "OBC", "SC", "ST"] as Category[]).map((value) => (
            <Badge key={value} className={category === value ? "bg-[#006AFF] text-white" : "bg-white"}>
              <button type="button" onClick={() => setCategory(value)}>
                {value}
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <Button className="mt-5" onClick={check}>
        Check Chances
      </Button>
      {result ? (
        <div className={`mt-5 rounded-xl border p-4 ${result.tone === "green" ? "border-green-200 bg-green-50" : result.tone === "yellow" ? "border-yellow-200 bg-yellow-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex items-center justify-between">
            <div className="font-semibold">{result.label}</div>
            <div className="text-sm text-[#374151]">{result.message}</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white">
            <div className={`h-2 rounded-full ${result.tone === "green" ? "bg-green-500" : result.tone === "yellow" ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${result.fill}%` }} />
          </div>
        </div>
      ) : null}
    </Card>
  );
}
