"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import type { College } from "@/types";
import { normalizeWeights } from "@/lib/scoring";

const STORAGE_KEY = "collegefind_onboarded";

interface PriorityWeights {
  placement: number;
  fees: number;
  location: number;
  campusLife: number;
}

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [streams, setStreams] = useState<string[]>([]);
  const [exam, setExam] = useState("");
  const [priorityPreset, setPriorityPreset] = useState<string>("");
  const [weights, setWeights] = useState<PriorityWeights>({
    placement: 50,
    fees: 30,
    location: 20,
    campusLife: 0,
  });

  // Details Page specific state
  const [targetCollege, setTargetCollege] = useState<College | null>(null);
  const [expectedScore, setExpectedScore] = useState("");

  const getAvailableExams = () => {
    return ["JEE", "NEET", "CAT", "CUET", "GATE", "State CET"];
  };

  useEffect(() => {
    const onboarded = window.localStorage.getItem(STORAGE_KEY);
    if (!onboarded) {
      const timer = window.setTimeout(() => {
        setTargetCollege(null);
        setStep(0);
        setOpen(true);
      }, 500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.college) {
        setTargetCollege(customEvent.detail.college);
        // Pre-fill exam if college has cutoffs
        const collegeExams = customEvent.detail.college.cutoffs?.map((co: any) => co.exam) || [];
        if (collegeExams.length > 0) {
          setExam(collegeExams[0]);
        } else {
          setExam("JEE");
        }
        setStep(0);
        setOpen(true);
      } else {
        setTargetCollege(null);
        setStep(0);
        setOpen(true);
      }
    };
    window.addEventListener("open-onboarding", handleOpen);
    return () => window.removeEventListener("open-onboarding", handleOpen);
  }, []);

  if (!open) return null;

  const handlePresetSelect = (preset: string) => {
    setPriorityPreset(preset);
    if (preset === "placements") {
      setWeights({ placement: 70, fees: 15, location: 15, campusLife: 0 });
    } else if (preset === "fees") {
      setWeights({ placement: 20, fees: 70, location: 10, campusLife: 0 });
    } else if (preset === "location") {
      setWeights({ placement: 20, fees: 10, location: 70, campusLife: 0 });
    } else if (preset === "reputation") {
      setWeights({ placement: 30, fees: 10, location: 10, campusLife: 50 });
    }
  };

  const handleSliderChange = (key: keyof PriorityWeights, value: number) => {
    // If campusLife slider is adjusted, ensure we allow weights to normalize into it.
    // If it was 0, it becomes active.
    const nextWeights = normalizeWeights(key, value, weights);
    setWeights(nextWeights);
    // Clear selected preset since it has been customized
    setPriorityPreset("custom");
  };

  const finish = () => {
    const finalStreams = targetCollege ? targetCollege.streams : streams;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        streams: finalStreams,
        exam,
        weights,
        expectedScore: expectedScore || null,
        status: "completed",
      })
    );
    window.dispatchEvent(new Event("onboarding-updated"));
    setOpen(false);
  };

  const skip = () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status: "skipped" })
    );
    window.dispatchEvent(new Event("onboarding-updated"));
    setOpen(false);
  };

  const totalSum = weights.placement + weights.fees + weights.location + weights.campusLife;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text-primary/40 p-4">
      <Card className="w-full max-w-[520px] p-6 max-h-[90vh] overflow-y-auto border-brand-border-light bg-white">
        
        {/* Dynamic Header: Onboarding vs College Fit Score Analyzer */}
        {targetCollege ? (
          // Fit Score Calculator for the specific college
          <div className="space-y-5">
            <div>
              <h2 className="text-[20px] font-bold text-brand-text-primary">
                Fit Score Analyzer
              </h2>
              <p className="text-[12px] text-brand-text-muted mt-1">
                Calculate your compatibility score specifically for {targetCollege.name}.
              </p>
            </div>

            <div className="space-y-4">
              {/* Expected score input */}
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-brand-text-primary">
                  Expected / Current Score (Rank or Percentile)
                </label>
                <input
                  type="text"
                  value={expectedScore}
                  onChange={(e) => setExpectedScore(e.target.value)}
                  placeholder="e.g. 5000 Rank or 99 Percentile"
                  className="w-full h-10 border border-brand-border-light rounded-lg px-4 text-[13px] outline-none focus:border-brand-red font-medium text-brand-text-primary"
                />
              </div>

              {/* Priority Presets selection */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-brand-text-primary block">
                  Select Your Primary Preference Focus
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "placements", title: "ROI & Placements", desc: "Focus on packages" },
                    { id: "fees", title: "Affordable Fees", desc: "Prioritize lower fees" },
                    { id: "location", title: "Proximity", desc: "Closer to location" },
                    { id: "reputation", title: "Campus & NIRF", desc: "Rank & campus life" },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`w-full text-left rounded-xl border p-2.5 transition-colors ${
                        priorityPreset === preset.id
                          ? "border-brand-red bg-brand-red-tint/30"
                          : "border-brand-border-light hover:border-brand-text-muted"
                      }`}
                    >
                      <div className="font-bold text-[13px] text-brand-text-primary">{preset.title}</div>
                      <div className="text-[10px] text-brand-text-muted mt-0.5 font-semibold">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders Section */}
              <div className="space-y-3 pt-3 border-t border-brand-border-light">
                <div className="flex justify-between items-center text-[11px] font-bold text-brand-text-muted uppercase tracking-wider">
                  <span>Fine-tune Priorities</span>
                  <span className={totalSum === 100 ? "text-brand-green" : "text-brand-red"}>Total: {totalSum}%</span>
                </div>
                
                {[
                  { key: "placement", label: "Placement Packages" },
                  { key: "fees", label: "Low Tuition Fees" },
                  { key: "location", label: "Location Proximity" },
                  { key: "campusLife", label: "Campus & Infrastructure" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center text-[12px] font-bold text-brand-text-primary">
                      <span>{label}</span>
                      <span className="text-brand-blue font-extrabold">{weights[key as keyof PriorityWeights]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={weights[key as keyof PriorityWeights]}
                      onChange={(e) => handleSliderChange(key as keyof PriorityWeights, parseInt(e.target.value))}
                      className="w-full h-1 bg-brand-border-light rounded-lg appearance-none cursor-pointer accent-brand-blue"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setOpen(false)}
                className="flex-1 h-10 border-brand-border-light rounded-lg font-semibold text-[13px]"
              >
                Cancel
              </Button>
              <Button
                disabled={(!priorityPreset && totalSum !== 100) || !expectedScore.trim()}
                onClick={finish}
                className="flex-1 h-10 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg font-bold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze Fit
              </Button>
            </div>
          </div>
        ) : (
          // Global Onboarding Flow (Simplified, Efficient & Professional, Emoji-Free)
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {[0, 1].map((dot) => (
                  <span
                    key={dot}
                    className={`h-2 w-2 rounded-full ${dot === step ? "bg-brand-red" : "bg-[#E5E7EB]"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={skip}
                className="text-[12px] font-semibold text-brand-text-muted hover:text-brand-text-primary"
              >
                Skip Onboarding
              </button>
            </div>

            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[20px] font-bold text-brand-text-primary">Academic Profile Setup</h2>
                  <p className="text-[12px] text-brand-text-muted mt-1">Select your primary stream and exam to customize your feed.</p>
                </div>

                <div className="space-y-4">
                  {/* Select Stream */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-brand-text-primary block">Select Stream</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Engineering", "Medical", "Commerce", "Law", "Design", "Others"].map((stream) => (
                        <button
                          key={stream}
                          type="button"
                          className={`rounded-xl border p-2.5 text-left transition-colors ${
                            streams.includes(stream)
                              ? "border-brand-red bg-brand-red-tint/30"
                              : "border-brand-border-light hover:border-brand-text-muted"
                          }`}
                          onClick={() =>
                            setStreams((current) =>
                              current.includes(stream)
                                ? current.filter((item) => item !== stream)
                                : [...current, stream]
                            )
                          }
                        >
                          <div className="font-bold text-[13px] text-brand-text-primary">{stream}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Exam */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-brand-text-primary block">Select Primary Exam</label>
                    <div className="grid grid-cols-3 gap-2">
                      {getAvailableExams().map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setExam(value)}
                          className={`rounded-xl border p-2 text-center transition-colors ${
                            exam === value
                              ? "border-brand-red bg-brand-red-tint/30"
                              : "border-brand-border-light hover:border-brand-text-muted"
                          }`}
                        >
                          <span className="font-bold text-[12px] text-brand-text-primary">{value}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  disabled={streams.length === 0 || !exam}
                  onClick={() => setStep(1)}
                  className="w-full h-10 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg font-bold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-[20px] font-bold text-brand-text-primary">Configure Decision Weights</h2>
                  <p className="text-[12px] text-brand-text-muted mt-1">Select presets or adjust sliders to customize rankings.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "placements", title: "ROI & Placements", desc: "Packages first" },
                    { id: "fees", title: "Affordable Fees", desc: "Lower fee focus" },
                    { id: "location", title: "Proximity", desc: "Close to home" },
                    { id: "reputation", title: "Campus & NIRF", desc: "Rank & campus life" },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`w-full text-left rounded-xl border p-2.5 transition-colors ${
                        priorityPreset === preset.id
                          ? "border-brand-red bg-brand-red-tint/30"
                          : "border-brand-border-light hover:border-brand-text-muted"
                      }`}
                    >
                      <div className="font-bold text-[13px] text-brand-text-primary">{preset.title}</div>
                      <div className="text-[10px] text-brand-text-muted mt-0.5 font-semibold">{preset.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Sliders Section */}
                <div className="space-y-3 pt-3 border-t border-brand-border-light">
                  <div className="flex justify-between items-center text-[11px] font-bold text-brand-text-muted uppercase tracking-wider">
                    <span>Fine-tune Priorities</span>
                    <span className={totalSum === 100 ? "text-brand-green" : "text-brand-red"}>Total: {totalSum}%</span>
                  </div>
                  
                  {[
                    { key: "placement", label: "Placement Packages" },
                    { key: "fees", label: "Low Tuition Fees" },
                    { key: "location", label: "Location Proximity" },
                    { key: "campusLife", label: "Campus & Infrastructure" },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between items-center text-[12px] font-bold text-brand-text-primary">
                        <span>{label}</span>
                        <span className="text-brand-blue font-extrabold">{weights[key as keyof PriorityWeights]}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={weights[key as keyof PriorityWeights]}
                        onChange={(e) => handleSliderChange(key as keyof PriorityWeights, parseInt(e.target.value))}
                        className="w-full h-1 bg-brand-border-light rounded-lg appearance-none cursor-pointer accent-brand-blue"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(0)}
                    className="flex-1 h-10 border-brand-border-light rounded-lg font-semibold text-[13px]"
                  >
                    Back
                  </Button>
                  <Button
                    disabled={!priorityPreset && totalSum !== 100}
                    onClick={finish}
                    className="flex-1 h-10 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg font-bold text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Onboarding
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
