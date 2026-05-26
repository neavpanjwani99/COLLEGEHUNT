"use client";

import { useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Building2, Calendar, MapPin, Star } from "lucide-react";
import type { College } from "@/types";
import { Badge, Button, Card } from "@/components/ui";
import { formatFees, formatPackage } from "@/lib/utils";

export function DetailTabs({ college }: { college: College }) {
  const [tab, setTab] = useState("Overview");

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="flex gap-6 border-b border-[#E5E7EB]">
        {["Overview", "Courses and Fees", "Placements", "Reviews", "Admission"].map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`pb-4 text-sm ${tab === item ? "border-b-2 border-[#006AFF] text-[#006AFF]" : "text-[#6B7280]"}`}>
            {item}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <div className="space-y-6 py-8">
          <p className="max-w-3xl text-base leading-8 text-[#374151]">{college.overview}</p>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-5"><div className="text-xs uppercase text-[#6B7280]">Established</div><div className="mt-2 text-2xl font-bold">{college.established}</div></Card>
            <Card className="p-5"><div className="text-xs uppercase text-[#6B7280]">NIRF Rank</div><div className="mt-2 text-2xl font-bold">#{college.nirfRank}</div></Card>
            <Card className="p-5"><div className="text-xs uppercase text-[#6B7280]">Accreditation</div><div className="mt-2 text-2xl font-bold">{college.acreditation}</div></Card>
            <Card className="p-5"><div className="text-xs uppercase text-[#6B7280]">Annual Fees</div><div className="mt-2 text-2xl font-bold">{formatFees(college.annualFee)}</div></Card>
          </div>
          <div className="flex flex-wrap gap-2">{college.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
        </div>
      )}
      {tab === "Courses and Fees" && (
        <div className="space-y-3 py-8">
          {college.courses.map((course) => (
            <Card key={course.name} className="flex items-center justify-between p-5">
              <div>
                <div className="font-semibold">{course.name}</div>
                <Badge className="mt-2">{course.degree}</Badge>
              </div>
              <div className="font-semibold">{formatFees(course.annualFee)}</div>
            </Card>
          ))}
        </div>
      )}
      {tab === "Placements" && (
        <div className="space-y-6 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5"><div className="text-xs uppercase text-[#6B7280]">Avg Package</div><div className="mt-2 text-3xl font-bold">{formatPackage(college.placements[0]?.avgPackage ?? 0)}</div></Card>
            <Card className="p-5"><div className="text-xs uppercase text-[#6B7280]">Max Package</div><div className="mt-2 text-3xl font-bold">{formatPackage(college.placements[0]?.maxPackage ?? 0)}</div></Card>
            <Card className="p-5"><div className="text-xs uppercase text-[#6B7280]">Placement Rate</div><div className="mt-2 text-3xl font-bold">{college.placements[0]?.placementRate ?? 0}%</div></Card>
          </div>
          <Card className="p-6">
            <div className="mb-4 text-lg font-semibold">Average Package Trend (LPA)</div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={college.placements.slice().reverse()}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgPackage" fill="#006AFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="flex flex-wrap gap-2">{college.placements[0]?.topRecruiters.map((recruiter) => <Badge key={recruiter}><Building2 className="mr-2 h-3.5 w-3.5" />{recruiter}</Badge>)}</div>
        </div>
      )}
      {tab === "Reviews" && (
        <div className="py-8">
          <Card className="p-6">
            <div className="text-2xl font-bold">4.6</div>
            <div className="text-sm text-[#6B7280]">128 reviews</div>
          </Card>
        </div>
      )}
      {tab === "Admission" && (
        <div className="py-8">
          <Card className="p-6">
            <div className="text-lg font-semibold">Cutoff data</div>
            <div className="mt-4 space-y-3">
              {college.cutoffs.map((cutoff) => (
                <div key={`${cutoff.exam}-${cutoff.year}-${cutoff.category}`} className="flex justify-between border-b border-[#E5E7EB] pb-2 text-sm">
                  <span>{cutoff.exam}</span>
                  <span>{cutoff.category}</span>
                  <span>{cutoff.year}</span>
                  <span>{cutoff.cutoffValue}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
