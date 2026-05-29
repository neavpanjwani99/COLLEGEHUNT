import { Metadata } from "next";
import { Suspense } from "react";
import CompareClient from "./client";

export const metadata: Metadata = {
  title: "Compare Colleges Side-by-Side | Fees, Placements & Ranks | CollegeHunt",
  description: "Use our decision priority engine to compare Indian colleges. Drag weights to balance placement packages, tuition fees, location proximity, and campus infrastructure.",
  alternates: {
    canonical: "https://collegehunt.vercel.app/compare",
  },
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CompareClient />
    </Suspense>
  );
}