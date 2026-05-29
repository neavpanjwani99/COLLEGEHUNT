"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Sparkles, BookOpen, Layers, Award, Landmark, GraduationCap, Compass, HelpCircle, School, MapPin, ChevronDown } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { colleges } from "@/lib/seed-data";

type SearchContext = "colleges" | "exams" | "courses" | "more";

const CATEGORIES = [
  { name: "Engineering", count: 10, icon: Compass, query: "Engineering" },
  { name: "Medical", count: 3, icon: Award, query: "Medical" },
  { name: "Management", count: 8, icon: Layers, query: "Management" },
  { name: "Law", count: 2, icon: Landmark, query: "Law" },
  { name: "Science", count: 4, icon: BookOpen, query: "Science" },
  { name: "Commerce", count: 2, icon: GraduationCap, query: "Commerce" },
  { name: "Arts", count: 2, icon: HelpCircle, query: "Arts" },
  { name: "Others", count: 0, icon: Sparkles, query: "" },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchContext>("colleges");
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showPersonaliseBanner, setShowPersonaliseBanner] = useState(false);
  const [onboardedState, setOnboardedState] = useState<any>(null);
  const [aiMatches, setAiMatches] = useState<any[]>([]);

  // Extract unique locations from seed data
  const locations = Array.from(new Set(colleges.map((c) => c.city))).sort();

  const calculateAIMatches = (statusObj: any) => {
    let weights = { placement: 50, fees: 30, location: 20 };
    if (statusObj && (statusObj.status === "completed" || statusObj.status === "onboarded") && statusObj.weights) {
      weights = statusObj.weights;
    }

    // Score all colleges
    const scoredColleges = colleges.map((col) => {
      // 1. Placement Score
      const avgPackage = col.placements[0]?.avgPackage ?? 0;
      let placementScore = 50;
      if (avgPackage >= 18) placementScore = 100;
      else if (avgPackage >= 12) placementScore = 85;
      else if (avgPackage >= 8) placementScore = 70;

      // 2. Fees Score
      const minFee = Math.min(...col.courses.map((c) => c.annualFee), 500000);
      let feesScore = 50;
      if (minFee <= 100000) feesScore = 100;
      else if (minFee <= 250000) feesScore = 85;
      else if (minFee <= 500000) feesScore = 70;

      // 3. Location/Infrastructure Score
      const infraScore = col.nirfRank && col.nirfRank <= 10 ? 95 : 80;

      const totalWeight = weights.placement + weights.fees + weights.location || 100;
      const compatibility = Math.round(
        (placementScore * weights.placement +
          feesScore * weights.fees +
          infraScore * weights.location) /
          totalWeight
      );

      return {
        ...col,
        matchScore: compatibility,
      };
    });

    // Sort by compatibility descending, take top 2
    const sorted = [...scoredColleges].sort((a, b) => b.matchScore - a.matchScore);
    setAiMatches(sorted.slice(0, 2));
  };

  const checkOnboardingStatus = () => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("collegefind_onboarded");
      if (stored) {
        const parsed = JSON.parse(stored);
        setOnboardedState(parsed);
        if (parsed.status === "skipped" || !parsed.status) {
          setShowPersonaliseBanner(true);
        } else {
          setShowPersonaliseBanner(false);
        }
        calculateAIMatches(parsed);
      } else {
        setShowPersonaliseBanner(true);
        calculateAIMatches(null);
      }
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
    window.addEventListener("onboarding-updated", checkOnboardingStatus);
    return () => window.removeEventListener("onboarding-updated", checkOnboardingStatus);
  }, []);

  const getPlaceholderText = () => {
    switch (activeTab) {
      case "colleges":
        return "Search by college name...";
      case "courses":
        return "Search by course or degree...";
      case "exams":
        return "Search by exam name...";
      case "more":
        return "Search placements, cities, cutoffs...";
      default:
        return "Search...";
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchText) params.set("q", searchText);
    if (selectedLocation) params.set("city", selectedLocation.toLowerCase());
    
    if (activeTab === "colleges") {
      router.push(`/colleges?${params.toString()}`);
    } else if (activeTab === "courses") {
      router.push(`/colleges?course=${searchText.toLowerCase()}`);
    } else if (activeTab === "exams") {
      router.push(`/colleges?exam=${searchText.toUpperCase() || "JEE"}`);
    } else if (activeTab === "more") {
      router.push(`/colleges?${params.toString()}`);
    }
  };

  const triggerOnboarding = () => {
    window.dispatchEvent(new Event("open-onboarding"));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Premium Hero Layout Section - 64px vertical padding */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-[1360px] px-6 grid grid-cols-1 lg:grid-cols-[78%_22%] gap-5 items-stretch">
          
          {/* Left Hero Card: Search Column with Graduation Image Overlay */}
          <div className="relative overflow-hidden rounded-[28px] border border-brand-border-light shadow-sm min-h-[440px] flex flex-col justify-between p-8 sm:p-10 bg-white">
            
            {/* Background Image of Graduates throwing caps with right-to-left linear gradient fade */}
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Graduation celebration"
                fill
                priority
                className="object-cover object-right opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
            </div>

            {/* Top Text content (relative to overlay above image) */}
            <div className="relative z-10 space-y-3 max-w-lg">
              <h1 className="text-[36px] sm:text-[40px] font-extrabold text-brand-text-primary leading-[1.15] tracking-tight">
                Find the right <span className="text-brand-red">college.</span><br />
                Shape your future.
              </h1>
              <p className="text-[15px] sm:text-[16px] text-brand-text-muted font-bold tracking-tight">
                Search colleges, exams, courses and more. All in one place.
              </p>
            </div>

            {/* Bottom Search Box Overlay (White box with search inputs) */}
            <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-[20px] border border-brand-border-light/80 p-5 shadow-lg w-full max-w-[620px] mt-6">
              
              {/* Tab Selector with Icons */}
              <div className="flex gap-6 border-b border-brand-border-light pb-2.5 mb-4">
                {/* Colleges Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("colleges")}
                  className={`flex items-center gap-1.5 text-[13px] font-bold pb-1 outline-none border-b-2 transition-all ${
                    activeTab === "colleges"
                      ? "border-brand-red text-brand-red"
                      : "border-transparent text-brand-text-muted hover:text-brand-text-primary"
                  }`}
                >
                  <School className="h-4 w-4" />
                  Colleges
                </button>

                {/* Exams Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("exams")}
                  className={`flex items-center gap-1.5 text-[13px] font-bold pb-1 outline-none border-b-2 transition-all ${
                    activeTab === "exams"
                      ? "border-brand-red text-brand-red"
                      : "border-transparent text-brand-text-muted hover:text-brand-text-primary"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  Exams
                </button>

                {/* Courses Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("courses")}
                  className={`flex items-center gap-1.5 text-[13px] font-bold pb-1 outline-none border-b-2 transition-all ${
                    activeTab === "courses"
                      ? "border-brand-red text-brand-red"
                      : "border-transparent text-brand-text-muted hover:text-brand-text-primary"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Courses
                </button>

                {/* More Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("more")}
                  className={`flex items-center gap-1.5 text-[13px] font-bold pb-1 outline-none border-b-2 transition-all ${
                    activeTab === "more"
                      ? "border-brand-red text-brand-red"
                      : "border-transparent text-brand-text-muted hover:text-brand-text-primary"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  More
                </button>
              </div>

              {/* Search Inputs Row */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 items-center w-full">
                {/* Query Input */}
                <div className="relative w-full sm:w-[60%] min-w-0">
                  <Search className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-brand-text-muted" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={getPlaceholderText()}
                    className="w-full h-11 bg-brand-bg-soft pl-10 pr-3.5 text-[14px] border border-brand-border-light focus:border-brand-text-muted rounded-lg outline-none font-semibold text-brand-text-primary"
                  />
                </div>

                {/* Location selector dropdown */}
                <div className="relative w-full sm:w-[25%]">
                  <MapPin className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-brand-text-muted" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-11 bg-brand-bg-soft pl-10 pr-8 text-[14px] border border-brand-border-light focus:border-brand-text-muted rounded-lg outline-none font-semibold text-brand-text-primary appearance-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
                </div>

                {/* Search Now button */}
                <button
                  type="submit"
                  className="w-full sm:w-[15%] h-11 bg-brand-red hover:bg-brand-red-hover text-white text-[14px] font-bold rounded-lg transition-colors outline-none shrink-0"
                >
                  Search
                </button>
              </form>

            </div>
          </div>

          {/* Right Hero Card: Plan with AI Widget */}
          <div className="rounded-[28px] border border-brand-border-light shadow-sm p-5 py-6 flex flex-col justify-between bg-white min-h-[440px] relative">
            
            {/* Header section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="relative h-7 w-7 bg-brand-red-tint rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-brand-red fill-current" />
                  </div>
                  <span className="text-[13px] font-extrabold text-brand-red uppercase tracking-wider">AI FIT MATCH</span>
                </div>
                {(onboardedState?.status === "completed" || onboardedState?.status === "onboarded") && (
                  <Badge className="bg-brand-green/10 text-brand-green border-transparent font-bold text-[10px]">ACTIVE</Badge>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-[16px] font-extrabold text-brand-text-primary leading-tight">
                  Your top matched colleges
                </h3>
                <p className="text-[11px] text-brand-text-muted font-bold leading-normal">
                  {(onboardedState?.status === "completed" || onboardedState?.status === "onboarded") 
                    ? "Based on your custom weights & preferences" 
                    : "Complete the 30s quiz to personalize matches"}
                </p>
              </div>
            </div>

            {/* Match Cards List */}
            <div className="space-y-2.5 my-4">
              {aiMatches.map((col) => (
                <div key={col.id} className="p-3 border border-brand-border-light rounded-xl hover:border-brand-red transition-all duration-150 text-left bg-brand-bg-soft/40 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-brand-text-muted truncate max-w-[130px]">{col.city}, {col.state}</span>
                    <span className="text-[11px] font-extrabold text-brand-red flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3 fill-current" />
                      {col.matchScore}% Match
                    </span>
                  </div>
                  <div className="font-extrabold text-[13px] text-brand-text-primary mt-1 line-clamp-1">
                    {col.name}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-brand-text-muted font-bold">
                    <span>Avg pkg: {col.placements[0]?.avgPackage} LPA</span>
                    <span>NIRF: {col.nirfRank ? `#${col.nirfRank}` : "N/A"}</span>
                  </div>
                  <Link href={`/colleges/${col.slug}`} className="absolute inset-0 z-10" />
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <button
              onClick={triggerOnboarding}
              className="w-full h-10 bg-brand-red hover:bg-brand-red-hover text-white text-[12px] font-bold rounded-lg transition-colors outline-none flex items-center justify-center gap-1.5 shadow-sm"
            >
              {(onboardedState?.status === "completed" || onboardedState?.status === "onboarded") ? "Retake Priority Quiz" : "Take the Quiz"}
            </button>

            <div className="text-center mt-3">
              <Link href="/colleges" className="text-[11.5px] font-bold text-brand-red hover:text-brand-red-hover block">
                Browse all colleges directory &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Browse by Category Row */}
      <section className="py-6 bg-white border-b border-brand-border-light">
        <div className="mx-auto max-w-[1360px] px-6 space-y-4">
          <h3 className="text-[12px] font-extrabold uppercase tracking-widest text-brand-text-muted">
            Browse by Stream Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const linkUrl = cat.query ? `/colleges?stream=${cat.query.toLowerCase()}` : `/colleges`;
              return (
                <Link
                  key={cat.name}
                  href={linkUrl}
                  className="border border-brand-border-light hover:border-brand-red hover:shadow-sm p-4 rounded-2xl text-center bg-white flex flex-col items-center justify-center gap-2 group transition-all duration-150 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-bg-soft group-hover:bg-[#FFF0F2] flex items-center justify-center transition-colors">
                    <Icon className="h-4.5 w-4.5 text-brand-text-muted group-hover:text-brand-red group-hover:scale-105 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[12.5px] font-bold text-brand-text-primary group-hover:text-brand-red transition-colors truncate w-full">
                      {cat.name}
                    </div>
                    <div className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-brand-bg-soft text-brand-text-muted font-bold text-[9px]">
                      {cat.count} Colleges
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 bg-brand-bg-soft/40 border-b border-brand-border-light">
        <div className="mx-auto max-w-[1360px] px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-red">SUCCESS STORIES</span>
            <h2 className="text-[24px] font-extrabold text-brand-text-primary">Trusted by thousands of students</h2>
            <p className="text-[13px] text-brand-text-body font-medium">
              See how our decision priority engine helped students find their ideal match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 border-brand-border-light rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <p className="text-[13.5px] text-brand-text-body font-medium italic leading-relaxed">
                "Adjusting the tuition fees and placement package sliders allowed me to see exactly which IIT matched my priorities. The comparison table with average packages saved me weeks of manual spreadsheet tracking."
              </p>
              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-brand-border-light">
                <div className="h-9 w-9 rounded-full bg-brand-red-tint flex items-center justify-center font-bold text-brand-red text-xs shrink-0">
                  AR
                </div>
                <div>
                  <h4 className="text-[12.5px] font-bold text-brand-text-primary">Aman Rawat</h4>
                  <p className="text-[11px] text-brand-text-muted font-semibold">IIT Kharagpur, B.Tech</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 border-brand-border-light rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <p className="text-[13.5px] text-brand-text-body font-medium italic leading-relaxed">
                "I was torn between government medical colleges and top private universities. CollegeHunt's ownership filter and PDF export feature helped me present a clear side-by-side comparison to my parents."
              </p>
              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-brand-border-light">
                <div className="h-9 w-9 rounded-full bg-brand-blue-tint flex items-center justify-center font-bold text-brand-blue text-xs shrink-0">
                  SD
                </div>
                <div>
                  <h4 className="text-[12.5px] font-bold text-brand-text-primary">Sneha Deshmukh</h4>
                  <p className="text-[11px] text-brand-text-muted font-semibold">AIIMS Delhi, MBBS</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 border-brand-border-light rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <p className="text-[13.5px] text-brand-text-body font-medium italic leading-relaxed">
                "The real-time composite matching score widget changed the game for me. Setting Location Proximity to 40% and Placements to 60% immediately highlighted BITS Pilani as my top compatibility match."
              </p>
              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-brand-border-light">
                <div className="h-9 w-9 rounded-full bg-[#E8F8EE] flex items-center justify-center font-bold text-brand-green text-xs shrink-0">
                  KK
                </div>
                <div>
                  <h4 className="text-[12.5px] font-bold text-brand-text-primary">Kunal Kapoor</h4>
                  <p className="text-[11px] text-brand-text-muted font-semibold">BITS Pilani, Computer Science</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Decision Engine Features */}
      <section className="py-10 bg-white border-b border-brand-border-light">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="mb-8 text-center max-w-xl mx-auto space-y-1.5">
            <h2 className="text-[24px] font-bold text-brand-text-primary">Decision Engine Features</h2>
            <p className="text-[13px] text-brand-text-body font-medium">
              We go beyond lists. Our interface allows you to weigh criteria and rank colleges in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 border-brand-border-light rounded-xl space-y-3 bg-white">
              <div className="h-9 w-9 bg-brand-red-tint text-brand-red rounded-lg flex items-center justify-center">
                <Search className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-[16px] font-bold text-brand-text-primary">Structured Filters</h3>
              <p className="text-[13px] text-brand-text-body font-medium leading-relaxed">
                Filter by stream, location, ownership, and annual fees simultaneously. Keep dynamic sharing states synced in URLs.
              </p>
            </Card>

            <Card className="p-5 border-brand-border-light rounded-xl space-y-3 bg-white">
              <div className="h-9 w-9 bg-brand-blue-tint text-brand-blue rounded-lg flex items-center justify-center">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-[16px] font-bold text-brand-text-primary">Smart Scoring</h3>
              <p className="text-[13px] text-brand-text-body font-medium leading-relaxed">
                Weigh placements, fees, and location percentages using sliders. Re-order listings dynamically to fit your priorities.
              </p>
            </Card>

            <Card className="p-5 border-brand-border-light rounded-xl space-y-3 bg-white">
              <div className="h-9 w-9 bg-brand-green/10 text-brand-green rounded-lg flex items-center justify-center">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-[16px] font-bold text-brand-text-primary">Detailed Comparison</h3>
              <p className="text-[13px] text-brand-text-body font-medium leading-relaxed">
                Compare side-by-side. Highlight winner packages and calculate average/maximum placement package deltas.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

// Small helper ChevronDown Icon
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
