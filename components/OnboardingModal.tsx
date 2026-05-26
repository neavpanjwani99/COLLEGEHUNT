"use client";

import { useEffect, useState } from "react";
import { Button, Card, Badge } from "@/components/ui";

const STORAGE_KEY = "collegefind_onboarded";

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [streams, setStreams] = useState<string[]>([]);
  const [exam, setExam] = useState("");
  const [priority, setPriority] = useState("Placement Package");

  const getAvailableExams = () => {
    let available: string[] = [];
    if (streams.includes("Engineering")) available.push("JEE Main", "JEE Advanced", "BITSAT", "State CET");
    if (streams.includes("Medical")) available.push("NEET", "AIIMS");
    if (streams.includes("Commerce")) available.push("CUET", "IPMAT", "CA Foundation");
    if (streams.includes("Law")) available.push("CLAT", "AILET", "LSAT");
    return Array.from(new Set(available.length > 0 ? available : ["CUET", "State CET", "Other"]));
  };

  // hook the user to complete onboarding if they haven't already
  useEffect(() => {
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      const timer = window.setTimeout(() => setOpen(true), 500);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  if (!open) return null;

  const finish = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ streams, exam, priority }));
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-[520px] p-10">
        <div className="mb-6 flex gap-2">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className={`h-2.5 w-2.5 rounded-full ${dot === step ? "bg-[#006AFF]" : "bg-[#E5E7EB]"}`} />
          ))}
        </div>
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">What are you planning to study?</h2>
            <div className="grid grid-cols-2 gap-3">
              {["Engineering", "Medical", "Commerce", "Law"].map((stream) => (
                <button key={stream} type="button" className={`rounded-xl border p-5 text-left ${streams.includes(stream) ? "border-[#006AFF] bg-[#EFF6FF]" : "border-[#E5E7EB]"}`} onClick={() => setStreams((current) => (current.includes(stream) ? current.filter((item) => item !== stream) : [...current, stream]))}>
                  <div className="font-medium">{stream}</div>
                </button>
              ))}
            </div>
            <Button disabled={streams.length === 0} onClick={() => setStep(1)}>Next</Button>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Which exam are you preparing for?</h2>
            <div className="flex flex-wrap gap-2">
              {getAvailableExams().map((value) => (
                <Badge key={value} className={exam === value ? "bg-[#006AFF] text-white" : "bg-white"}>
                  <button type="button" onClick={() => setExam(value)}>{value}</button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
              <Button disabled={!exam} onClick={() => setStep(2)}>Next</Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">What matters most to you?</h2>
            <div className="space-y-2">
              {["Placement Package", "Low Fees", "College Location"].map((value) => (
                <button key={value} type="button" className={`w-full rounded-xl border p-4 text-left ${priority === value ? "border-[#006AFF] bg-[#EFF6FF]" : "border-[#E5E7EB]"}`} onClick={() => setPriority(value)}>
                  {value}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={finish}>Finish</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
