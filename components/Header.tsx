"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "@/app/images/Logo.png";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useShortlist } from "@/context/ShortlistContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useState } from "react";

function HeaderContent() {
  const { shortlist } = useShortlist();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-6 px-6">
          <Link href="/" className="flex items-center">
            <Image 
              src={logoImg} 
              alt="CollegeHunt" 
              height={40} 
              width={160} 
              priority 
              className="object-contain h-10 w-auto" 
              style={{ height: "40px", width: "auto" }} 
            />
          </Link>

          <div className="relative max-w-[150px] xs:max-w-[200px] sm:max-w-[280px] md:max-w-[360px] lg:max-w-[400px] flex-1 block">
            <Search className="absolute left-3.5 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#FF385C]" />
            <Input 
              value={query} 
              onChange={(e) => handleSearch(e.target.value)} 
              placeholder="Browse colleges..." 
              className="w-full h-9 md:h-10 bg-white pl-9 md:pl-11 text-[13px] md:text-[14px] border-gray-200 focus-visible:ring-1 focus-visible:ring-[#FF385C] focus-visible:border-[#FF385C] rounded-full shadow-sm hover:shadow-md transition-shadow duration-150 font-semibold" 
            />
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-6 text-sm font-semibold text-[#717171]">
              <Link href="/colleges" className={`hover:text-[#222222] transition-colors ${pathname === '/colleges' ? 'text-[#222222] border-b-2 border-[#FF385C] pb-1' : ''}`}>Browse</Link>
              <Link href="/compare" className={`hover:text-[#222222] transition-colors ${pathname === '/compare' ? 'text-[#222222] border-b-2 border-[#FF385C] pb-1' : ''}`}>Compare Engine</Link>
            </nav>
            
            <Link href="/shortlist">
              <Button variant="secondary" className="h-10 font-semibold border-gray-200 shadow-sm rounded-full text-[#222222] hover:bg-gray-50">
                My Shortlist 
                <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FF385C] px-1.5 text-[11px] font-bold text-white">
                  {shortlist.length}
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle & Dropdown */}
          <div className="relative md:hidden">
            <button className="text-[#222222] focus:outline-none p-2 hover:bg-gray-100 rounded-full" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            {/* White Airbnb-like Dropdown Popup */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl bg-white border border-gray-200 p-2 shadow-xl z-50">
                <nav className="flex flex-col text-[14px] font-semibold text-[#222222]">
                  <Link href="/colleges" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors">
                    <Search className="h-[18px] w-[18px] text-[#FF385C]" />
                    Browse Colleges
                  </Link>
                  <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors">
                    <ArrowRight className="h-[18px] w-[18px] text-[#FF385C]" />
                    Smart Compare
                  </Link>
                  <Link href="/shortlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors">
                    <div className="flex w-[18px] justify-center relative">
                      <ArrowRight className="h-[18px] w-[18px] text-[#FF385C]" />
                      {shortlist.length > 0 && (
                        <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF385C] text-[10px] font-bold text-white shadow-sm">
                          {shortlist.length}
                        </span>
                      )}
                    </div>
                    My Shortlist
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export function Header() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-40 w-full h-[72px] border-b border-[#E5E7EB] bg-white" />}>
      <HeaderContent />
    </Suspense>
  );
}
