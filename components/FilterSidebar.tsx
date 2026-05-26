"use client";

import { Input, Badge } from "@/components/ui";

export function FilterSidebar({
  city,
  setCity,
  minFee,
  setMinFee,
  maxFee,
  setMaxFee,
  type,
  setType,
  streams,
  toggleStream,
  clear,
}: {
  city: string;
  setCity: (value: string) => void;
  minFee: string;
  setMinFee: (value: string) => void;
  maxFee: string;
  setMaxFee: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  streams: string[];
  toggleStream: (stream: string) => void;
  clear: () => void;
}) {
  const streamList = ["Engineering", "Medical", "Commerce", "Law", "Arts"];
  const typeList = ["Government", "Private", "Deemed"];

  return (
    <aside className="sticky top-16 h-fit rounded-none border-r border-[#E5E7EB] bg-[#F9FAFB] p-6">
      <div className="space-y-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#6B7280]">Stream</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {streamList.map((stream) => (
              <Badge key={stream} className={streams.includes(stream) ? "bg-[#006AFF] text-white" : "bg-white"}>
                <button type="button" onClick={() => toggleStream(stream)}>
                  {stream}
                </button>
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#6B7280]">Type</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["All", ...typeList].map((value) => (
              <Badge key={value} className={type === value ? "bg-[#006AFF] text-white" : "bg-white"}>
                <button type="button" onClick={() => setType(value)}>
                  {value}
                </button>
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#6B7280]">City</div>
          <Input className="mt-3 bg-white" value={city} onChange={(event) => setCity(event.target.value)} />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#6B7280]">Annual Fees</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Input type="number" placeholder="₹0" value={minFee} onChange={(event) => setMinFee(event.target.value)} />
            <Input type="number" placeholder="₹50,00,000" value={maxFee} onChange={(event) => setMaxFee(event.target.value)} />
          </div>
        </div>
        <button type="button" className="text-sm font-medium text-[#006AFF]" onClick={clear}>
          Clear all filters
        </button>
      </div>
    </aside>
  );
}
