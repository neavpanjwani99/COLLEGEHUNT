"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "@/app/images/Logo.png";
import { Search, Menu, X, ArrowRight, BookOpen, Layers, Sparkles } from "lucide-react";
import { Input, Button } from "@/components/ui";
import { useShortlist } from "@/context/ShortlistContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { colleges } from "@/data/colleges";

// Build autocomplete database dynamically from seed data
const autocompleteItems = [
  ...colleges.map((c) => ({
    name: c.name,
    type: "college" as const,
    slug: c.slug,
    sub: `${c.city}, ${c.state}`,
  })),
  ...Array.from(new Set(colleges.map((c) => c.city))).map((city) => ({
    name: city,
    type: "city" as const,
    slug: city.toLowerCase(),
    sub: "Location",
  })),
  ...Array.from(new Set(colleges.flatMap((c) => c.cutoffs.map((co) => co.exam)))).map((exam) => ({
    name: exam,
    type: "exam" as const,
    slug: exam.toLowerCase(),
    sub: "Exam Eligibility",
  })),
  ...Array.from(new Set(colleges.flatMap((c) => c.courses.map((co) => co.name)))).map((course) => ({
    name: course,
    type: "course" as const,
    slug: course.toLowerCase(),
    sub: "Academic Program",
  })),
];

const STREAMS = [
  { name: "MBA", category: "Management" },
  { name: "Engineering", category: "Engineering" },
  { name: "Medical", category: "Medical" },
  { name: "Design", category: "Design" },
  { name: "Science", category: "Science" },
  { name: "Law", category: "Law" },
  { name: "Commerce", category: "Commerce" },
  { name: "Others", category: "Others" },
];

function HeaderContent() {
  const { shortlist } = useShortlist();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof autocompleteItems>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [hoveredMegaMenu, setHoveredMegaMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize input value with URL when query param changes
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions list
  const handleInputChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = autocompleteItems.filter((item) =>
      item.name.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredSuggestions(filtered.slice(0, 8));
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  };

  // Perform actual search action
  const selectSuggestion = (item: typeof autocompleteItems[0]) => {
    setShowSuggestions(false);
    setQuery(item.name);

    if (item.type === "college") {
      router.push(`/colleges/${item.slug}`);
    } else if (item.type === "city") {
      router.push(`/colleges?city=${item.name.toLowerCase()}`);
    } else if (item.type === "exam") {
      router.push(`/colleges?exam=${item.name.toUpperCase()}`);
    } else if (item.type === "course") {
      router.push(`/colleges?course=${item.name.toLowerCase()}`);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setActiveSuggestionIndex((prev) => (prev + 1) % filteredSuggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setActiveSuggestionIndex(
          (prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
        selectSuggestion(filteredSuggestions[activeSuggestionIndex]);
      } else {
        // Default text search
        const params = new URLSearchParams(searchParams);
        if (query) {
          params.set("q", query);
        } else {
          params.delete("q");
        }
        setShowSuggestions(false);
        router.push(`/colleges?${params.toString()}`);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <>
      {/* Primary 64px Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#DDDDDD] bg-white h-[64px]">
        <div className="mx-auto flex h-full max-w-[1360px] items-center justify-between gap-6 px-6">
          
          {/* Logo (left) */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={logoImg}
              alt="CollegeHunt"
              height={44}
              width={176}
              priority
              className="object-contain h-11 w-auto"
              style={{ height: "42px", width: "auto" }}
            />
          </Link>

          {/* Autocomplete Search Bar (centered, full-width on mobile collapse) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-[480px] hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-brand-red" />
              <Input
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => query && setShowSuggestions(true)}
                placeholder="Search colleges, cities, exams, or courses..."
                className="w-full h-10 bg-white pl-10 pr-4 text-[14px] border-brand-border-light focus:border-brand-red rounded-lg outline-none font-medium"
              />
            </div>

            {/* Typeahead Autocomplete Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 max-h-[360px] overflow-y-auto rounded-lg border border-brand-border-light bg-white py-2 shadow-card z-50">
                {filteredSuggestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(item)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-[14px] font-medium outline-none ${
                      index === activeSuggestionIndex ? "bg-brand-bg-soft text-brand-text-primary" : "text-brand-text-body hover:bg-brand-bg-soft"
                    }`}
                  >
                    <div>
                      <div className="text-brand-text-primary">{item.name}</div>
                      <div className="text-[11px] text-brand-text-muted mt-0.5">{item.sub}</div>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-brand-text-muted px-2 py-0.5 rounded bg-brand-bg-soft border border-brand-border-light">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login / Sign Up CTA & Shortlist (right) */}
          <div className="hidden items-center gap-4 md:flex shrink-0">
            <Link href="/compare">
              <button className="text-[14px] font-semibold text-brand-text-muted hover:text-brand-text-primary">
                Compare Tool
              </button>
            </Link>
            
            <Link href="/shortlist" className="relative">
              <button className="flex items-center gap-1.5 text-[14px] font-semibold text-brand-text-muted hover:text-brand-text-primary">
                Shortlist
                {shortlist.length > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-red px-1.5 text-[11px] font-bold text-white">
                    {shortlist.length}
                  </span>
                )}
              </button>
            </Link>

            <div className="h-4 w-px bg-brand-border-light" />

            <button
              onClick={() => setShowLoginModal(true)}
              className="text-[14px] font-semibold text-brand-text-primary hover:text-brand-red"
            >
              Log In
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className="h-9 px-4 rounded-lg bg-brand-red text-white text-[13px] font-semibold hover:bg-brand-red-hover"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle & Dropdown */}
          <div className="relative md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-text-primary focus:outline-none p-2 hover:bg-brand-bg-soft rounded-full"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Light Theme Dropdown Popup */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl bg-white border border-brand-border-light p-1.5 shadow-xl z-50">
                <nav className="flex flex-col text-[14px] font-semibold text-brand-text-primary">
                  <Link href="/colleges" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-bg-soft hover:text-brand-red transition-colors">
                    <Search className="h-[18px] w-[18px] text-brand-text-muted" />
                    Browse Colleges
                  </Link>
                  <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-bg-soft hover:text-brand-red transition-colors">
                    <ArrowRight className="h-[18px] w-[18px] text-brand-text-muted" />
                    Smart Compare
                  </Link>
                  <Link href="/shortlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-bg-soft hover:text-brand-red transition-colors">
                    <div className="flex w-[18px] justify-center relative">
                      <ArrowRight className="h-[18px] w-[18px] text-brand-text-muted" />
                      {shortlist.length > 0 && (
                        <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white shadow-sm">
                          {shortlist.length}
                        </span>
                      )}
                    </div>
                    My Shortlist
                  </Link>
                  <div className="h-px bg-brand-border-light my-1" />
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLoginModal(true);
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-bg-soft hover:text-brand-red transition-colors text-left w-full outline-none text-[14px] font-semibold"
                  >
                    <ArrowRight className="h-[18px] w-[18px] text-brand-text-muted" />
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLoginModal(true);
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-bg-soft hover:text-brand-red transition-colors text-left w-full outline-none text-[14px] font-semibold"
                  >
                    <ArrowRight className="h-[18px] w-[18px] text-brand-text-muted" />
                    Sign Up
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mega Menu under navbar (MBA | Engineering | Medical | Design | Science | Law | Commerce | Others) */}
      <nav className="w-full bg-white border-b border-brand-border-light h-11 hidden md:block z-40 relative">
        <div className="mx-auto max-w-[1360px] h-full px-6 flex items-center justify-start gap-8">
          {STREAMS.map((stream) => (
            <div
              key={stream.name}
              className="h-full flex items-center"
              onMouseEnter={() => setHoveredMegaMenu(stream.name)}
              onMouseLeave={() => setHoveredMegaMenu(null)}
            >
              <button
                className={`text-[13px] font-bold uppercase tracking-wider h-full flex items-center border-b-2 outline-none ${
                  hoveredMegaMenu === stream.name
                    ? "border-brand-red text-brand-text-primary"
                    : "border-transparent text-brand-text-muted hover:text-brand-text-primary"
                }`}
              >
                {stream.name}
              </button>

              {/* Hover Panel - Top colleges, tools, courses */}
              {hoveredMegaMenu === stream.name && (
                <div className="absolute top-11 left-0 right-0 bg-white border-b border-brand-border-light shadow-card z-50 py-8">
                  <div className="mx-auto max-w-[1360px] px-6 grid grid-cols-3 gap-8">
                    
                    {/* Top Colleges */}
                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted mb-4 flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-brand-red" />
                        Top {stream.name} Colleges
                      </h4>
                      <ul className="space-y-3">
                        {colleges
                          .filter((c) => c.streams.includes(stream.category))
                          .slice(0, 3)
                          .map((col) => (
                            <li key={col.slug}>
                              <Link
                                href={`/colleges/${col.slug}`}
                                onClick={() => setHoveredMegaMenu(null)}
                                className="text-[14px] font-semibold text-brand-text-primary hover:text-brand-red flex items-center justify-between"
                              >
                                <span>{col.name}</span>
                                <span className="text-[11px] text-brand-text-muted font-normal">
                                  NIRF #{col.nirfRank || "N/A"}
                                </span>
                              </Link>
                            </li>
                          ))}
                        {colleges.filter((c) => c.streams.includes(stream.category)).length === 0 && (
                          <li className="text-[13px] text-brand-text-muted">No colleges seeded for this stream</li>
                        )}
                      </ul>
                    </div>

                    {/* Quick Tools */}
                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted mb-4 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-brand-red" />
                        Decision & Prep Tools
                      </h4>
                      <ul className="space-y-3">
                        <li>
                          <Link
                            href="/compare"
                            onClick={() => setHoveredMegaMenu(null)}
                            className="text-[14px] font-semibold text-brand-text-primary hover:text-brand-red flex items-center gap-2"
                          >
                            <span>Smart Compare Engine</span>
                            <ArrowRight className="h-3.5 w-3.5 text-brand-text-muted" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/colleges"
                            onClick={() => setHoveredMegaMenu(null)}
                            className="text-[14px] font-semibold text-brand-text-primary hover:text-brand-red flex items-center gap-2"
                          >
                            <span>Cutoff Trend Analyzer</span>
                            <ArrowRight className="h-3.5 w-3.5 text-brand-text-muted" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/colleges"
                            onClick={() => setHoveredMegaMenu(null)}
                            className="text-[14px] font-semibold text-brand-text-primary hover:text-brand-red flex items-center gap-2"
                          >
                            <span>NIRF Ranking Directory</span>
                            <ArrowRight className="h-3.5 w-3.5 text-brand-text-muted" />
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Popular Courses */}
                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-wider text-brand-text-muted mb-4 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-brand-red" />
                        Popular Programs
                      </h4>
                      <ul className="space-y-3">
                        {colleges
                          .filter((c) => c.streams.includes(stream.category))
                          .flatMap((c) => c.courses)
                          .filter((course, index, self) => self.findIndex(x => x.degree === course.degree) === index)
                          .slice(0, 3)
                          .map((course) => (
                            <li key={course.degree}>
                              <Link
                                href={`/colleges?course=${course.degree.toLowerCase()}`}
                                onClick={() => setHoveredMegaMenu(null)}
                                className="text-[14px] font-semibold text-brand-text-primary hover:text-brand-red flex items-center justify-between"
                              >
                                <span>{course.degree} {course.name.split(" ").slice(1).join(" ")}</span>
                                <span className="text-[11px] text-brand-text-muted font-normal bg-brand-bg-soft px-1.5 py-0.5 rounded">
                                  Popular
                                </span>
                              </Link>
                            </li>
                          ))}
                        {colleges.filter((c) => c.streams.includes(stream.category)).length === 0 && (
                          <li className="text-[13px] text-brand-text-muted">No courses seeded</li>
                        )}
                      </ul>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>



      {/* Dummy Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-brand-text-primary/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white border border-brand-border-light rounded-xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-brand-text-muted hover:text-brand-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-[20px] font-bold text-brand-text-primary mb-2">CollegeHunt Account</h3>
            <p className="text-[14px] text-brand-text-body mb-6">
              Access your personalized feed, save shortlists, and analyze custom placement stats.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-10 border border-brand-border-light rounded-lg px-3.5 text-[14px] outline-none focus:border-brand-red"
              />
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full h-10 rounded-lg bg-brand-red text-white text-[14px] font-bold hover:bg-brand-red-hover"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Header() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-50 w-full h-[64px] border-b border-[#DDDDDD] bg-white" />}>
      <HeaderContent />
    </Suspense>
  );
}
