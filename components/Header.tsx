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
          <Link href="/colleges" className="flex items-center">
            <Image src={logoImg} alt="CollegeHunt" height={28} className="object-contain h-7 w-auto" />
          </Link>

          <div className="relative hidden max-w-[400px] flex-1 lg:block">
            <Search className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9CA3AF]" />
            <Input 
              value={query} 
              onChange={(e) => handleSearch(e.target.value)} 
              placeholder="Search by college or city..." 
              className="w-full h-10 bg-[#F9FAFB] pl-11 text-[14px] border-[#E5E7EB] focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-[#006AFF] focus-visible:border-[#006AFF] rounded-lg shadow-sm" 
            />
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {/* Desktop Navigation Links Moved Here */}
            <nav className="flex items-center gap-6 text-sm font-medium text-[#6B7280]">
              <Link href="/colleges" className={`hover:text-[#111827] transition-colors ${pathname === '/colleges' ? 'text-[#111827]' : ''}`}>Browse</Link>
              <Link href="/compare" className={`hover:text-[#111827] transition-colors ${pathname === '/compare' ? 'text-[#111827]' : ''}`}>Compare Engine</Link>
            </nav>
            
            <Link href="/shortlist">
              <Button variant="secondary" className="h-10 font-semibold border-[#E5E7EB] shadow-sm">
                My Shortlist 
                <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#111827] px-1.5 text-[11px] font-bold text-white">
                  {shortlist.length}
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle & Dropdown */}
          <div className="relative md:hidden">
            <button className="text-[#111827] focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            {/* Dark Theme Dropdown Popup */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-4 w-56 origin-top-right rounded-2xl bg-[#202020] p-1.5 shadow-2xl ring-1 ring-white/10 z-50">
                <nav className="flex flex-col text-[14px] font-medium text-[#E5E7EB]">
                  <Link href="/colleges" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors">
                    <Search className="h-[18px] w-[18px] text-[#9CA3AF]" />
                    Browse Colleges
                  </Link>
                  <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors">
                    <ArrowRight className="h-[18px] w-[18px] text-[#9CA3AF]" />
                    Smart Compare
                  </Link>
                  <Link href="/shortlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-colors">
                    <div className="flex w-[18px] justify-center relative">
                      <ArrowRight className="h-[18px] w-[18px] text-[#9CA3AF]" />
                      {shortlist.length > 0 && (
                        <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white shadow-sm">
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
