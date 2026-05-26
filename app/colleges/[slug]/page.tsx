import { notFound } from "next/navigation";
import { colleges } from "@/data/colleges";
import { DetailTabs } from "@/components/DetailTabs";
import { Button, Badge } from "@/components/ui";
import Link from "next/link";
import { Calendar, ChevronRight, MapPin } from "lucide-react";

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const college = colleges.find((item) => item.slug === slug);
  if (!college) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-[#E5E7EB]">
        <div className="mx-auto flex max-w-[1200px] items-start justify-between gap-6 px-6 py-10">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <span>Colleges</span>
              <ChevronRight className="h-3 w-3" />
              <span>{college.streams[0]}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{college.name}</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold">{college.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{college.city}</span>
              <Badge className="bg-[#006AFF] text-white">NIRF #{college.nirfRank}</Badge>
              <Badge className="bg-green-50 text-green-700">{college.acreditation}</Badge>
              <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{college.established}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={college.website} target="_blank">
              <Button>Apply Now</Button>
            </Link>
            <Button variant="secondary">Save to Shortlist</Button>
          </div>
        </div>
      </div>
      <DetailTabs college={college} />
    </div>
  );
}
