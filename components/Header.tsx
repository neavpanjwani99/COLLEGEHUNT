"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useShortlist } from "@/context/ShortlistContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";

function HeaderContent() {
  const { shortlist } = useShortlist();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    // Only filter actively if we are on the colleges page
    if (pathname === "/colleges") {
      router.replace(`/colleges?${params.toString()}`, { scroll: false });
    } else {
      router.push(`/colleges?${params.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/colleges" className="text-[22px] font-bold tracking-tight text-[#111827]">
          CollegeHunt<span className="text-[#006AFF]">.</span>
        </Link>
        <div className="relative hidden max-w-[480px] flex-1 md:block">
          <Search className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
          <Input 
            value={query} 
            onChange={(e) => handleSearch(e.target.value)} 
            placeholder="Search by college or city..." 
            className="w-full h-11 bg-[#F9FAFB] pl-11 text-[15px] border-[#E5E7EB] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#006AFF] focus-visible:border-[#006AFF] rounded-lg shadow-sm" 
          />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/shortlist">
            <Button variant="secondary" className="h-10 font-semibold border-[#E5E7EB] shadow-sm">
              My Shortlist 
              <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#111827] px-1.5 text-[11px] font-bold text-white">
                {shortlist.length}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-40 w-full h-[72px] border-b border-[#E5E7EB] bg-white" />}>
      <HeaderContent />
    </Suspense>
  );
}
