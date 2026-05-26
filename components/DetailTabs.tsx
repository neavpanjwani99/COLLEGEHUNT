"use client";

import { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Building2, ChevronDown, ChevronRight, Clock3, Calendar, MapPin, Star, TrendingDown, TrendingUp } from "lucide-react";
import type { College } from "@/types";
import { Badge, Button, Card } from "@/components/ui";
import { formatFees, formatPackage } from "@/lib/utils";
import { AdmissionPredictor } from "@/components/AdmissionPredictor";
import { useShortlist } from "@/context/ShortlistContext";

type TabKey = "Overview" | "Courses and Fees" | "Placements" | "Reviews" | "Admission";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const yearData = college.placements.slice().sort((a, b) => a.year - b.year);
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

  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-4 pb-10">
      <div className="flex gap-6 border-b border-[#E5E7EB]">
        {( ["Overview", "Courses and Fees", "Placements", "Reviews", "Admission"] as TabKey[] ).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`pb-4 text-sm font-semibold transition-all ${tab === item ? "border-b-2 border-[#FF385C] text-[#FF385C]" : "text-[#717171]"}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-6 py-8">
          <p className="max-w-3xl text-[16px] leading-8 text-[#374151]">{college.overview}</p>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-5">
              <div className="text-xs uppercase tracking-[0.04em] text-[#717171] font-semibold">Established Year</div>
              <div className="mt-2 text-3xl font-bold text-[#222222]">{college.established}</div>
            </Card>
            <Card className="p-5">
              <div className="text-xs uppercase tracking-[0.04em] text-[#717171] font-semibold">NIRF Rank</div>
              <div className="mt-2 text-3xl font-bold text-[#222222]">#{college.nirfRank}</div>
            </Card>
            <Card className="p-5">
              <div className="text-xs uppercase tracking-[0.04em] text-[#717171] font-semibold">Accreditation</div>
              <div className="mt-2 text-3xl font-bold text-[#222222]">{college.acreditation}</div>
            </Card>
            <Card className="p-5">
              <div className="text-xs uppercase tracking-[0.04em] text-[#717171] font-semibold">Annual Fees</div>
              <div className="mt-2 text-3xl font-bold text-[#222222]">{formatFees(college.annualFee)}</div>
            </Card>
          </div>
          <div className="flex flex-wrap gap-2">
            {college.tags.map((tag) => (
              <Badge key={tag} className="rounded-full px-3 py-1 font-semibold">{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {tab === "Courses and Fees" && (
        <div className="space-y-3 py-8">
          {college.courses.map((course) => (
            <Card key={`${course.name}-${course.degree}`} className="flex items-center justify-between p-5 rounded-2xl">
              <div>
                <div className="font-bold text-[#222222]">{course.name}</div>
                <Badge className="mt-2 rounded-full font-semibold">{course.degree}</Badge>
              </div>
              <div className="text-sm font-bold text-[#222222]">{formatFees(course.annualFee)}</div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Placements" && (
        <div className="space-y-6 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <div className="text-xs uppercase tracking-[0.04em] text-[#717171] font-semibold">Avg Package this year</div>
              <div className="mt-2 text-3xl font-bold text-[#222222]">{formatPackage(college.placements[0]?.avgPackage ?? 0)}</div>
            </Card>
            <Card className="p-5">
              <div className="text-xs uppercase tracking-[0.04em] text-[#717171] font-semibold">Max Package this year</div>
              <div className="mt-2 text-3xl font-bold text-[#222222]">{formatPackage(college.placements[0]?.maxPackage ?? 0)}</div>
            </Card>
            <Card className="p-5">
              <div className="text-xs uppercase tracking-[0.04em] text-[#717171] font-semibold">Placement Rate this year</div>
              <div className="mt-2 text-3xl font-bold text-[#222222]">{college.placements[0]?.placementRate ?? 0}%</div>
            </Card>
          </div>
          <Card className="p-6 rounded-2xl">
            <div className="mb-4 text-lg font-bold text-[#222222]">Average Package Trend (LPA)</div>
            <div className="h-[280px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearData}>
                    <XAxis dataKey="year" stroke="#717171" tickLine={false} />
                    <YAxis stroke="#717171" tickLine={false} />
                    <Tooltip cursor={{ fill: '#FFF0F2', opacity: 0.5 }} />
                    <Bar dataKey="avgPackage" fill="#FF385C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-gray-50 animate-pulse rounded" />
              )}
            </div>
          </Card>
          <div>
            <div className="mb-3 text-sm font-medium uppercase tracking-[0.04em] text-[#6B7280]">Top Recruiters</div>
            <div className="flex flex-wrap gap-2">
              {topRecruiters.map((recruiter) => (
                <Badge key={recruiter}>
                  <Building2 className="mr-2 h-3.5 w-3.5" />
                  {recruiter}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <div className="space-y-6 py-8">
          <Card className="p-6">
            <div className="text-4xl font-bold text-[#111827]">4.6</div>
            <div className="mt-1 text-sm text-[#6B7280]">{reviews.length} reviews</div>
            <div className="mt-3">
              <Stars rating={5} />
            </div>
          </Card>
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={`${review.author}-${review.batch}`} className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[#111827]">{review.author}</div>
                    <div className="text-sm text-[#6B7280]">Batch {review.batch}</div>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-4 text-sm leading-7 text-[#374151]">{review.body}</p>
                <div className="mt-4">
                  <Badge>{review.stream}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "Admission" && (
        <div className="space-y-6 py-8">
          <div className="space-y-4">
            {cutoffGroups.map(([exam, list]) => (
              <Card key={exam} className="p-5">
                <div className="mb-4 text-lg font-semibold text-[#111827]">{exam} Cutoffs</div>
                <div className="grid grid-cols-4 gap-3 text-sm font-medium text-[#6B7280]">
                  <div>Category</div>
                  <div>2023 Cutoff</div>
                  <div>2024 Cutoff</div>
                  <div>Trend</div>
                </div>
                <div className="mt-3 space-y-3">
                  {Array.from(new Set(list.map((cutoff) => cutoff.category))).map((category) => {
                    const current = list.find((entry) => entry.category === category && entry.year === 2024);
                    const previous = list.find((entry) => entry.category === category && entry.year === 2023);
                    if (!current && !previous) return null;
                    const trend = current && previous ? current.cutoffValue - previous.cutoffValue : 0;
                    return (
                      <div key={category} className="grid grid-cols-4 gap-3 border-t border-[#E5E7EB] pt-3 text-sm">
                        <div>{category}</div>
                        <div>{previous?.cutoffValue ?? "-"}</div>
                        <div>{current?.cutoffValue ?? "-"}</div>
                        <div className="flex items-center gap-2">
                          {trend < 0 ? <TrendingDown className="h-4 w-4 text-green-600" /> : trend > 0 ? <TrendingUp className="h-4 w-4 text-red-600" /> : <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />}
                          <span>{trend < 0 ? "Easier" : trend > 0 ? "Harder" : "Flat"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
          <AdmissionPredictor college={college} />
        </div>
      )}
      <div className="mt-8 flex items-center gap-3">
        <Button variant="secondary" onClick={() => toggleShortlist(college.id)}>
          {shortlisted ? "Saved to Shortlist" : "Save to Shortlist"}
        </Button>
        <a href={college.website} target="_blank" rel="noreferrer">
          <Button>Apply Now</Button>
        </a>
      </div>
    </div>
  );
}
