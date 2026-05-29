import { Metadata } from "next";
import { colleges } from "@/lib/seed-data";
import CollegesClient from "./client";

export const metadata: Metadata = {
  title: "Top Colleges in India 2026 | Fees, Cutoffs & Placements | CollegeHunt",
  description: "Browse the best Engineering, Medical, MBA, and Law colleges in India for 2026. Filter by annual tuition, NIRF ranking, government ownership, and average package.",
  alternates: {
    canonical: "https://collegehunt.vercel.app/colleges",
  },
  openGraph: {
    title: "Top Colleges in India 2026 | Fees, Cutoffs & Placements | CollegeHunt",
    description: "Browse the best Engineering, Medical, MBA, and Law colleges in India for 2026. Filter by annual tuition, NIRF ranking, government ownership, and average package.",
    url: "https://collegehunt.vercel.app/colleges",
    type: "website",
  },
};

export default function CollegesPage() {
  // Generate JSON-LD ItemList schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Top Colleges in India 2026",
    "numberOfItems": colleges.length,
    "itemListElement": colleges.map((c, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://collegehunt.vercel.app/colleges/${c.slug}`,
      "name": c.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {/* Search intent H1 - strictly 1 per page */}
      <div className="sr-only">
        <h1>Top Colleges in India 2026 | Fees, Rankings & Placements</h1>
      </div>
      <CollegesClient colleges={colleges} />
    </>
  );
}
