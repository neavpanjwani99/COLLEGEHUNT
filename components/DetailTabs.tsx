"use client";

import { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { Building2, ChevronDown, ChevronUp, Clock3, Calendar, MapPin, Star, TrendingDown, TrendingUp, Info, ArrowUpDown, Sparkles } from "lucide-react";
import type { College } from "@/types";
import { Badge, Button, Card } from "@/components/ui";
import { formatFees, formatPackage } from "@/lib/utils";
import { AdmissionPredictor } from "@/components/AdmissionPredictor";
import { useShortlist } from "@/context/ShortlistContext";

type TabKey = "Overview" | "Courses & Fees" | "Placements" | "Reviews" | "Admission";

const reviewSeed: Record<string, Array<{ author: string; batch: string; rating: number; body: string; stream: string }>> = {
  "IIT Bombay": [
    { author: "Aarav Mehta", batch: "2024", rating: 5, body: "Campus culture is intense but rewarding. The peer group and clubs make a huge difference.", stream: "Engineering" },
    { author: "Sara Khan", batch: "2023", rating: 5, body: "Placements are excellent and the alumni network is strong across product and research roles.", stream: "Engineering" },
    { author: "Rohan Das", batch: "2022", rating: 4, body: "Academic workload is high, but the infrastructure and opportunities are top tier.", stream: "Engineering" },
  ],
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < rating ? "fill-amber-400 text-amber-400" : "text-[#E5E7EB]"}`} />
      ))}
    </div>
  );
}

export function DetailTabs({ college }: { college: College }) {
  const [tab, setTab] = useState<TabKey>("Overview");
  const { isShortlisted, toggleShortlist } = useShortlist();
  const shortlisted = isShortlisted(college.id);
  const [mounted, setMounted] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  // Onboarding settings state
  const [onboarded, setOnboarded] = useState<{
    streams: string[];
    exam: string;
    weights: { placement: number; fees: number; location: number; campusLife: number };
    status: string;
  } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("collegefind_onboarded");
    if (data) {
      try {
        setOnboarded(JSON.parse(data));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      const data = localStorage.getItem("collegefind_onboarded");
      if (data) {
        try {
          setOnboarded(JSON.parse(data));
        } catch (e) {}
      }
    };
    window.addEventListener("onboarding-updated", handleUpdate);
    return () => window.removeEventListener("onboarding-updated", handleUpdate);
  }, []);

  // Calculate dynamic fit match score using priority weights
  const calculatedMatchScore = useMemo(() => {
    if (!onboarded || !onboarded.weights) return null;
    const w = onboarded.weights;
    const total = w.placement + w.fees + w.location + w.campusLife;
    if (total === 0) return 80;

    // 1. Placement Score (higher avg package is better, base of 20 LPA as 100%)
    const avgPkg = college.placements[0]?.avgPackage ?? 6;
    const placementScore = Math.min(100, Math.max(30, (avgPkg / 20) * 100));

    // 2. Fees Score (lower annual fee is better, base of 5L as 100%, 25L as 30%)
    const feeLPA = college.annualFee;
    const feesScore = Math.min(100, Math.max(25, (1 - (feeLPA - 0.5) / 5) * 100));

    // 3. Location Score (standard base match)
    const locationScore = 85; 

    // 4. Campus Life (established age + accreditation)
    const age = new Date().getFullYear() - college.established;
    const campusScore = Math.min(100, Math.max(50, 60 + (age / 10) + (college.acreditation.includes("A") ? 20 : 10)));

    const composite = (
      (placementScore * w.placement) +
      (feesScore * w.fees) +
      (locationScore * w.location) +
      (campusScore * w.campusLife)
    ) / total;

    return Math.round(composite);
  }, [onboarded, college]);

  const handleHelpful = (author: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [author]: (prev[author] || 0) + 1,
    }));
  };

  // Sorting state for Courses
  const [courseSortOrder, setCourseSortOrder] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const yearData = useMemo(() => {
    return college.placements.slice().sort((a, b) => a.year - b.year);
  }, [college.placements]);

  const topRecruiters = college.placements[0]?.topRecruiters ?? [];
  
  const reviews = reviewSeed[college.name] ?? [
    { author: "Student A", batch: "2024", rating: 5, body: "Good faculty, strong placements, and a useful peer network.", stream: college.streams[0] },
    { author: "Student B", batch: "2023", rating: 4, body: "The college has a structured campus life and good exposure.", stream: college.streams[0] },
    { author: "Student C", batch: "2022", rating: 4, body: "Fees are justified by the opportunities and alumni support.", stream: college.streams[0] },
  ];

  const cutoffGroups = useMemo(() => {
    const byExam = new Map<string, typeof college.cutoffs>();
    college.cutoffs.forEach((cutoff) => {
      const list = byExam.get(cutoff.exam) ?? [];
      list.push(cutoff);
      byExam.set(cutoff.exam, list);
    });
    return Array.from(byExam.entries());
  }, [college.cutoffs]);

  // Sort courses dynamically based on user selection
  const sortedCourses = useMemo(() => {
    const coursesCopy = [...college.courses];
    if (courseSortOrder === "asc") {
      coursesCopy.sort((a, b) => a.annualFee - b.annualFee);
    } else if (courseSortOrder === "desc") {
      coursesCopy.sort((a, b) => b.annualFee - a.annualFee);
    }
    return coursesCopy;
  }, [college.courses, courseSortOrder]);

  const toggleCourseSort = () => {
    if (courseSortOrder === null) {
      setCourseSortOrder("asc");
    } else if (courseSortOrder === "asc") {
      setCourseSortOrder("desc");
    } else {
      setCourseSortOrder(null);
    }
  };

  // Determine program duration (default 4 years for B.Tech/B.E, 2 for MBA/M.Tech, 5 for MBBS/LLB)
  const getDuration = (degree: string) => {
    const d = degree.toUpperCase();
    if (d.includes("B.TECH") || d.includes("B.E.")) return 4;
    if (d.includes("MBA") || d.includes("M.TECH") || d.includes("M.E.")) return 2;
    if (d.includes("MBBS") || d.includes("LLB")) return 5;
    return 3;
  };

  return (
    <div className="mx-auto max-w-[1360px] px-6 pt-4 pb-10">
      
      {/* Tab selection links */}
      <div className="flex gap-6 border-b border-brand-border-light">
        {(["Overview", "Courses & Fees", "Placements", "Reviews", "Admission"] as TabKey[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`pb-4 text-sm font-bold uppercase tracking-wider border-b-2 outline-none transition-all ${
              tab === item ? "border-brand-red text-brand-red" : "border-transparent text-brand-text-muted hover:text-brand-text-primary"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "Overview" && (
        <div className="space-y-8 py-8">
          {/* F2: Decision Flow (AI Assist) Match Score Card */}
          {calculatedMatchScore !== null ? (
            <div className="bg-gradient-to-r from-brand-red-tint/30 via-brand-blue-tint/20 to-white border border-brand-red/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-[11px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Fit Match Score
                </div>
                <h4 className="text-[20px] font-bold text-brand-text-primary">
                  Your Compatibility: <span className="text-brand-red">{calculatedMatchScore}% Match</span>
                </h4>
                <p className="text-[13px] text-brand-text-muted font-bold leading-relaxed max-w-xl">
                  Based on your priority profile (Placement: {onboarded?.weights.placement}%, Fees: {onboarded?.weights.fees}%, Location: {onboarded?.weights.location}%, Campus Life: {onboarded?.weights.campusLife}%).
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-4 bg-white border border-brand-border-light rounded-2xl p-4 shadow-card">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full border-4 border-brand-red/10 border-t-brand-red">
                  <span className="text-[15px] font-extrabold text-brand-text-primary">{calculatedMatchScore}%</span>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-brand-text-primary">Perfect Fit Analysis</div>
                  <div className="text-[11px] text-brand-text-muted font-bold mt-0.5">
                    {calculatedMatchScore >= 80 ? "Top Recommendation" : "Good Alternative"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-brand-bg-soft border border-brand-border-light rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1">
                <h4 className="text-[18px] font-bold text-brand-text-primary">
                  Wondering if {college.name} fits your expectations?
                </h4>
                <p className="text-[13px] text-brand-text-muted font-semibold max-w-xl">
                  Take a 30-second priority assessment to calculate your personalized fit score and sort colleges dynamically.
                </p>
              </div>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-onboarding", { detail: { college } }))}
                className="h-10 px-5 bg-brand-red hover:bg-brand-red-hover text-white text-[13px] font-bold rounded-lg shrink-0 transition-colors shadow-sm outline-none"
              >
                Analyze My Fit Score
              </button>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-[16px] font-bold text-brand-text-primary">Institute Profile Overview</h3>
            <p className="max-w-4xl text-[15px] leading-relaxed text-brand-text-body font-medium">
              {college.overview}
            </p>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="p-5 border-brand-border-light shadow-card bg-white">
              <div className="text-[11px] uppercase tracking-wider text-brand-text-muted font-bold">Established</div>
              <div className="mt-2 text-2xl font-bold text-brand-text-primary">{college.established}</div>
            </Card>
            <Card className="p-5 border-brand-border-light shadow-card bg-white">
              <div className="text-[11px] uppercase tracking-wider text-brand-text-muted font-bold">NIRF Rank</div>
              <div className="mt-2 text-2xl font-bold text-brand-text-primary">
                {college.nirfRank ? `#${college.nirfRank}` : "N/A"}
              </div>
            </Card>
            <Card className="p-5 border-brand-border-light shadow-card bg-white">
              <div className="text-[11px] uppercase tracking-wider text-brand-text-muted font-bold">Accreditation</div>
              <div className="mt-2 text-2xl font-bold text-brand-text-primary">{college.acreditation}</div>
            </Card>
            <Card className="p-5 border-brand-border-light shadow-card bg-white">
              <div className="text-[11px] uppercase tracking-wider text-brand-text-muted font-bold">Annual Fees</div>
              <div className="mt-2 text-2xl font-bold text-brand-text-primary">{formatFees(college.annualFee)}</div>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2">
            {college.tags.map((tag) => (
              <Badge key={tag} className="rounded-full px-3 py-1 font-bold text-[12px] bg-brand-bg-soft border-brand-border-light text-brand-text-body">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Quick FAQ loop section */}
          <div className="border-t border-brand-border-light pt-6 space-y-4">
            <h3 className="text-[16px] font-bold text-brand-text-primary">Frequently Asked Questions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white border border-brand-border-light rounded-xl p-4 shadow-sm">
                <div className="font-bold text-brand-text-primary text-[14px]">Q: What is the average placement package at {college.name}?</div>
                <div className="text-[13px] text-brand-text-muted font-semibold mt-1">A: The average package this year is {formatPackage(college.placements[0]?.avgPackage ?? 0)} with a highest package of {formatPackage(college.placements[0]?.maxPackage ?? 0)}.</div>
              </div>
              <div className="bg-white border border-brand-border-light rounded-xl p-4 shadow-sm">
                <div className="font-bold text-brand-text-primary text-[14px]">Q: Is hostel facility available at {college.name}?</div>
                <div className="text-[13px] text-brand-text-muted font-semibold mt-1">A: Yes, comprehensive hostel accommodations are available for both male and female students with complete facilities.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COURSES & FEES TAB */}
      {tab === "Courses & Fees" && (
        <div className="py-8 space-y-4">
          <div className="overflow-x-auto border border-brand-border-light rounded-lg shadow-card">
            <table className="min-w-full divide-y divide-brand-border-light bg-white text-left">
              <thead className="bg-brand-bg-soft">
                <tr>
                  <th className="px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">
                    Degree
                  </th>
                  <th className="px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">
                    Academic Program Name
                  </th>
                  <th className="px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">
                    Duration
                  </th>
                  <th className="px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">
                    Intake / Seats
                  </th>
                  <th
                    onClick={toggleCourseSort}
                    className="px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted cursor-pointer hover:text-brand-text-primary select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Annual Tuition</span>
                      {courseSortOrder === "asc" ? (
                        <ChevronUp className="h-4.5 w-4.5 text-brand-red" />
                      ) : courseSortOrder === "desc" ? (
                        <ChevronDown className="h-4.5 w-4.5 text-brand-red" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-brand-text-muted" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">
                    Est. Total Fee
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border-light">
                {sortedCourses.map((course) => {
                  const duration = getDuration(course.degree);
                  const seats = course.name.toLowerCase().includes("computer") ? 120 : 60;
                  return (
                    <tr key={`${course.name}-${course.degree}`} className="hover:bg-brand-bg-soft/40">
                      <td className="px-6 py-4 text-[14px] font-bold text-brand-text-primary">
                        <Badge className="bg-brand-blue-tint text-brand-blue border-transparent font-bold">
                          {course.degree}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-brand-text-primary">
                        {course.name}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-brand-text-body font-medium">
                        {duration} Years
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-brand-text-muted">
                        {seats} Seats
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-brand-text-primary">
                        {formatFees(course.annualFee)}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-brand-blue">
                        {formatFees(course.annualFee * duration)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PLACEMENTS TAB */}
      {tab === "Placements" && (
        !college.placements || college.placements.length === 0 || college.placements[0]?.avgPackage === 0 ? (
          <div className="py-12 text-center text-[15px] font-semibold text-brand-text-muted">
            Placement data not yet available for this college
          </div>
        ) : (
          <div className="space-y-8 py-8">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card className="p-5 border-brand-border-light shadow-card bg-white">
              <div className="text-[11px] uppercase tracking-wider text-brand-text-muted font-bold">Avg Package this year</div>
              <div className="mt-2 text-3xl font-bold text-brand-blue">{formatPackage(college.placements[0]?.avgPackage ?? 0)}</div>
            </Card>
            <Card className="p-5 border-brand-border-light shadow-card bg-white">
              <div className="text-[11px] uppercase tracking-wider text-brand-text-muted font-bold">Max Package this year</div>
              <div className="mt-2 text-3xl font-bold text-brand-text-primary">{formatPackage(college.placements[0]?.maxPackage ?? 0)}</div>
            </Card>
            <Card className="p-5 border-brand-border-light shadow-card bg-white">
              <div className="text-[11px] uppercase tracking-wider text-brand-text-muted font-bold">Placement Rate this year</div>
              <div className="mt-2 text-3xl font-bold text-brand-green">{college.placements[0]?.placementRate ?? 0}%</div>
            </Card>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Average Package Bar Chart */}
            <Card className="p-6 border-brand-border-light shadow-card bg-white">
              <h3 className="mb-4 text-[16px] font-bold text-brand-text-primary">Average Package Trend (LPA)</h3>
              <div className="h-[260px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="year" stroke="#717171" tickLine={false} />
                      <YAxis stroke="#717171" tickLine={false} />
                      <Tooltip cursor={{ fill: "#FFF1F2", opacity: 0.5 }} />
                      <Bar dataKey="avgPackage" fill="#006AFF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-brand-bg-soft animate-pulse rounded-lg" />
                )}
              </div>
            </Card>

            {/* Line Chart showing salary progression & highest packages */}
            <Card className="p-6 border-brand-border-light shadow-card bg-white">
              <h3 className="mb-4 text-[16px] font-bold text-brand-text-primary">Package Progression (Avg vs Max)</h3>
              <div className="h-[260px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="year" stroke="#717171" tickLine={false} />
                      <YAxis stroke="#717171" tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="maxPackage" stroke="#FF385C" strokeWidth={2.5} name="Highest Package" activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="avgPackage" stroke="#006AFF" strokeWidth={2.5} name="Average Package" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-brand-bg-soft animate-pulse rounded-lg" />
                )}
              </div>
            </Card>
          </div>

          {/* Year-on-Year Placement Statistics Table */}
          <div className="space-y-4">
            <h4 className="text-[14px] font-bold text-brand-text-primary">Year-on-Year Placement Statistics</h4>
            <div className="overflow-x-auto border border-brand-border-light rounded-xl shadow-card bg-white">
              <table className="min-w-full divide-y divide-brand-border-light bg-white text-left">
                <thead className="bg-brand-bg-soft">
                  <tr>
                    <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">Year</th>
                    <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">Average Package</th>
                    <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">Highest Package</th>
                    <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">Placement Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border-light">
                  {yearData.map((item) => (
                    <tr key={item.year} className="hover:bg-brand-bg-soft/40">
                      <td className="px-6 py-4 text-[14px] font-bold text-brand-text-primary">{item.year}</td>
                      <td className="px-6 py-4 text-[14px] font-bold text-brand-blue">{formatPackage(item.avgPackage)}</td>
                      <td className="px-6 py-4 text-[14px] font-bold text-brand-red">{formatPackage(item.maxPackage)}</td>
                      <td className="px-6 py-4 text-[14px] text-brand-green font-bold">{item.placementRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-brand-text-muted">Top Campus Recruiters</h4>
            <div className="flex flex-wrap gap-2">
              {topRecruiters.map((recruiter) => (
                <Badge key={recruiter} className="bg-brand-bg-soft border-brand-border-light text-brand-text-body font-bold text-[12px]">
                  <Building2 className="mr-1.5 h-3.5 w-3.5 text-brand-red" />
                  {recruiter}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        )
      )}

      {/* REVIEWS TAB */}
      {tab === "Reviews" && (
        <div className="space-y-6 py-8">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 items-center">
            <Card className="p-6 border-brand-border-light shadow-card bg-white text-center">
              <div className="text-4xl font-extrabold text-brand-text-primary">4.6</div>
              <div className="mt-1.5 text-xs text-brand-text-muted font-bold">{reviews.length} Verified Reviews</div>
              <div className="mt-3 flex justify-center">
                <Stars rating={5} />
              </div>
            </Card>
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-brand-text-muted w-12">5 Star</span>
                <div className="flex-1 h-2.5 bg-brand-bg-soft rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red rounded-full" style={{ width: "70%" }} />
                </div>
                <span className="text-[12px] font-bold text-brand-text-muted w-8 text-right">70%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-brand-text-muted w-12">4 Star</span>
                <div className="flex-1 h-2.5 bg-brand-bg-soft rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red rounded-full" style={{ width: "20%" }} />
                </div>
                <span className="text-[12px] font-bold text-brand-text-muted w-8 text-right">20%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-bold text-brand-text-muted w-12">3 Star</span>
                <div className="flex-1 h-2.5 bg-brand-bg-soft rounded-full overflow-hidden">
                  <div className="h-full bg-brand-red rounded-full" style={{ width: "10%" }} />
                </div>
                <span className="text-[12px] font-bold text-brand-text-muted w-8 text-right">10%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[14px] font-bold text-brand-text-primary">Verified Student Testimonials</h4>
            <div className="space-y-3">
              {reviews.map((review) => (
                <Card key={`${review.author}-${review.batch}`} className="p-5 border-brand-border-light shadow-card bg-white relative">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-bg-soft flex items-center justify-center font-bold text-brand-red select-none">
                        {review.author[0]}
                      </div>
                      <div>
                        <div className="font-bold text-brand-text-primary text-[15px] flex items-center gap-2">
                          {review.author}
                          <span className="text-[10px] font-extrabold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full uppercase">Verified</span>
                        </div>
                        <div className="text-[12px] text-brand-text-muted font-semibold">Class of {review.batch} • {review.stream} Student</div>
                      </div>
                    </div>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="mt-3 text-[14px] leading-relaxed text-brand-text-body font-medium">{review.body}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-brand-bg-soft pt-3">
                    <button
                      onClick={() => handleHelpful(review.author)}
                      className="text-[12px] font-bold text-brand-text-muted hover:text-brand-red flex items-center gap-1.5 transition-colors outline-none"
                    >
                      Helpful ({helpfulCounts[review.author] || 4})
                    </button>
                    <span className="text-[11px] text-brand-text-muted">Posted on collegehunt.co</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADMISSION CUTOFFS TAB */}
      {tab === "Admission" && (
        <div className="space-y-8 py-8">
          {/* Chronological Timeline */}
          <div className="space-y-4">
            <h3 className="text-[16px] font-bold text-brand-text-primary">Admission Process Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-brand-border-light rounded-xl p-4 relative shadow-sm">
                <div className="w-8 h-8 rounded-full bg-brand-red text-white font-extrabold text-[14px] flex items-center justify-center mb-3">1</div>
                <div className="font-bold text-brand-text-primary text-[14px]">Registration</div>
                <p className="text-[12px] text-brand-text-muted mt-1 font-bold">Register online at the official counseling portal. Submit personal details.</p>
              </div>
              <div className="bg-white border border-brand-border-light rounded-xl p-4 relative shadow-sm">
                <div className="w-8 h-8 rounded-full bg-brand-red text-white font-extrabold text-[14px] flex items-center justify-center mb-3">2</div>
                <div className="font-bold text-brand-text-primary text-[14px]">Entrance Exam</div>
                <p className="text-[12px] text-brand-text-muted mt-1 font-bold">Provide valid scores from target national entrance exams (JEE/CAT/GATE).</p>
              </div>
              <div className="bg-white border border-brand-border-light rounded-xl p-4 relative shadow-sm">
                <div className="w-8 h-8 rounded-full bg-brand-red text-white font-extrabold text-[14px] flex items-center justify-center mb-3">3</div>
                <div className="font-bold text-brand-text-primary text-[14px]">Seat Counseling</div>
                <p className="text-[12px] text-brand-text-muted mt-1 font-bold">Participate in seat selection counseling. Confirm course preference.</p>
              </div>
              <div className="bg-white border border-brand-border-light rounded-xl p-4 relative shadow-sm">
                <div className="w-8 h-8 rounded-full bg-brand-red text-white font-extrabold text-[14px] flex items-center justify-center mb-3">4</div>
                <div className="font-bold text-brand-text-primary text-[14px]">Document Verification</div>
                <p className="text-[12px] text-brand-text-muted mt-1 font-bold">Verify documents in person and submit semester fee to book seat.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[16px] font-bold text-brand-text-primary">Exam Cutoffs Trend</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {cutoffGroups.map(([exam, list]) => (
                <Card key={exam} className="p-5 border-brand-border-light shadow-card bg-white">
                  <h3 className="mb-4 text-[16px] font-bold text-brand-text-primary">{exam} Exam Cutoff Ranks</h3>
                  <div className="grid grid-cols-4 gap-3 text-[11px] font-bold uppercase tracking-wider text-brand-text-muted border-b border-brand-border-light pb-2 mb-2">
                    <div>Category</div>
                    <div>2023 Cutoff</div>
                    <div>2024 Cutoff</div>
                    <div>Trend</div>
                  </div>
                  <div className="space-y-2">
                    {Array.from(new Set(list.map((cutoff) => cutoff.category))).map((category) => {
                      const current = list.find((entry) => entry.category === category && entry.year === 2024);
                      const previous = list.find((entry) => entry.category === category && entry.year === 2023);
                      if (!current && !previous) return null;
                      const trend = current && previous ? current.cutoffValue - previous.cutoffValue : 0;
                      return (
                        <div key={category} className="grid grid-cols-4 gap-3 text-[14px] font-medium text-brand-text-body py-1.5">
                          <div className="font-bold text-brand-text-primary">{category}</div>
                          <div>{previous?.cutoffValue ?? "-"}</div>
                          <div className="font-semibold text-brand-text-primary">{current?.cutoffValue ?? "-"}</div>
                          <div className="flex items-center gap-1.5">
                            {trend < 0 ? (
                              <span className="flex items-center gap-1 text-brand-green font-bold text-[12px]">
                                <TrendingDown className="h-4 w-4" />
                                Easier
                              </span>
                            ) : trend > 0 ? (
                              <span className="flex items-center gap-1 text-brand-red font-bold text-[12px]">
                                <TrendingUp className="h-4 w-4" />
                                Harder
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-brand-text-muted font-bold text-[12px]">
                                <ChevronDown className="h-4 w-4 rotate-90" />
                                Flat
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-[16px] font-bold text-brand-text-primary">Predict Admission Compatibility</h3>
            <AdmissionPredictor college={college} />
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions */}
      <div className="mt-8 flex items-center gap-3 border-t border-brand-border-light pt-6">
        <Button
          variant="secondary"
          onClick={() => toggleShortlist(college.id)}
          className="h-10 text-[14px] font-bold border-brand-border-light rounded-lg text-brand-text-primary hover:bg-brand-bg-soft"
        >
          {shortlisted ? "Saved in Shortlist" : "Save to Shortlist"}
        </Button>
        <a href={college.website} target="_blank" rel="noreferrer">
          <Button className="h-10 text-[14px] font-bold bg-brand-red text-white hover:bg-brand-red-hover rounded-lg">
            Apply Now
          </Button>
        </a>
      </div>
    </div>
  );
}
