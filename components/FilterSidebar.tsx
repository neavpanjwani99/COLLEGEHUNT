"use client";

import { Badge } from "@/components/ui";
import { colleges } from "@/data/colleges";

interface FilterSidebarProps {
  city: string;
  setCity: (value: string) => void;
  maxFee: number; // Max annual fee in LPA (0 to 25)
  setMaxFee: (value: number) => void;
  type: string; // "All" | "Government" | "Private" | "Deemed"
  setType: (value: string) => void;
  streams: string[];
  toggleStream: (stream: string) => void;
  clear: () => void;
}

const STREAM_LIST = ["Engineering", "Medical", "Commerce", "Law", "Design", "Others"];
const TYPE_LIST = ["Government", "Private", "Deemed"];

export function FilterSidebar({
  city,
  setCity,
  maxFee,
  setMaxFee,
  type,
  setType,
  streams,
  toggleStream,
  clear,
}: FilterSidebarProps) {
  // Extract unique cities from seed data
  const cities = Array.from(new Set(colleges.map((c) => c.city))).sort();

  return (
    <aside className="sticky top-[80px] h-fit rounded-xl border border-brand-border-light bg-brand-bg-soft p-5 space-y-6">
      <div className="flex justify-between items-center border-b border-brand-border-light pb-3">
        <h3 className="text-[14px] font-bold text-brand-text-primary uppercase tracking-wider">
          Filter Options
        </h3>
        <button
          type="button"
          onClick={clear}
          className="text-[12px] font-bold text-brand-red hover:text-brand-red-hover"
        >
          Clear All
        </button>
      </div>

      {/* Stream Multi-Select Badges */}
      <div className="space-y-3">
        <h4 className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">
          Target Stream
        </h4>
        <div className="flex flex-wrap gap-2">
          {STREAM_LIST.map((stream) => {
            const active = streams.includes(stream);
            return (
              <Badge
                key={stream}
                className={`rounded-full px-3 py-1 border font-bold text-[12px] cursor-pointer select-none transition-colors ${
                  active
                    ? "bg-brand-red text-white border-transparent"
                    : "bg-white border-brand-border-light text-brand-text-body hover:border-brand-text-muted"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleStream(stream)}
                  className="outline-none"
                >
                  {stream}
                </button>
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Ownership classification (Govt / Private / Deemed) */}
      <div className="space-y-3">
        <h4 className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">
          Ownership Classification
        </h4>
        <div className="flex flex-wrap gap-2">
          {["All", ...TYPE_LIST].map((val) => {
            const active = type === val;
            return (
              <Badge
                key={val}
                className={`rounded-full px-3 py-1 border font-bold text-[12px] cursor-pointer select-none transition-colors ${
                  active
                    ? "bg-brand-red text-white border-transparent"
                    : "bg-white border-brand-border-light text-brand-text-body hover:border-brand-text-muted"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setType(val)}
                  className="outline-none"
                >
                  {val}
                </button>
              </Badge>
            );
          })}
        </div>
      </div>

      {/* City Dropdown Selection */}
      <div className="space-y-3">
        <h4 className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">
          Campus Location
        </h4>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full h-10 bg-white border border-brand-border-light focus:border-brand-text-muted rounded-lg px-3 text-[14px] font-semibold text-brand-text-primary outline-none"
        >
          <option value="">All Locations</option>
          {cities.map((item) => (
            <option key={item} value={item.toLowerCase()}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Annual Fees slider (0 to 25L) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">Max Annual Fees</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="1"
              max="25"
              value={maxFee}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  setMaxFee(Math.max(1, Math.min(25, val)));
                }
              }}
              className="w-12 h-7 px-1 text-center bg-white border border-brand-border-light rounded-lg text-[13px] font-bold text-brand-blue outline-none focus:border-brand-blue"
            />
            <span className="text-[11px] font-bold text-brand-text-muted uppercase">LPA</span>
          </div>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="25"
            value={maxFee}
            onChange={(e) => setMaxFee(parseInt(e.target.value))}
            className="w-full h-1 bg-brand-border-light rounded-lg appearance-none cursor-pointer accent-brand-blue"
          />
          <div className="flex justify-between text-[11px] text-brand-text-muted font-bold">
            <span>₹1 Lakh</span>
            <span>₹25 Lakhs</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
