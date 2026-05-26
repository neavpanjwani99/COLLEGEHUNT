import { notFound } from "next/navigation";
import { colleges } from "@/data/colleges";
import { DetailTabs } from "@/components/DetailTabs";
import { Button, Badge } from "@/components/ui";
import Link from "next/link";
import { Calendar, ChevronRight, MapPin, Building2, ExternalLink } from "lucide-react";

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const college = colleges.find((item) => item.slug === slug);
  if (!college) notFound();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Clean White Hero Section */}
      <div className="bg-white border-b border-[#E5E7EB] pt-8 pb-10">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[13px] text-[#6B7280] font-medium mb-8">
            <Link href="/colleges" className="hover:text-[#111827] transition-colors">Colleges</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#111827]">{college.name}</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 md:items-start">
            {/* Minimal Logo */}
            <div className="h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-4">
              <img 
                src={college.logo} 
                alt={college.name} 
                className="h-full w-full object-contain"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-[#EFF6FF] text-[#006AFF] font-bold border-none hover:bg-[#EFF6FF]">NIRF Rank #{college.nirfRank}</Badge>
                <Badge className="bg-[#F3F4F6] text-[#4B5563] font-semibold border-none hover:bg-[#F3F4F6]">{college.acreditation}</Badge>
                <Badge className="bg-[#F3F4F6] text-[#4B5563] font-semibold border-none hover:bg-[#F3F4F6]">{college.type}</Badge>
              </div>
              <h1 className="text-3xl md:text-[36px] font-bold text-[#111827] tracking-tight leading-tight">
                {college.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-5 text-[15px] text-[#6B7280]">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{college.city}, {college.state}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Est. {college.established}</span>
                <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{college.streams[0]} Focus</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <Link href={college.website} target="_blank">
                <Button className="w-full text-[15px] h-12 bg-[#006AFF] text-white hover:bg-[#0056CC] border-none font-semibold">
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="bg-white border-b border-[#E5E7EB] shadow-sm">
        <DetailTabs college={college} />
      </div>
    </div>
  );
}
