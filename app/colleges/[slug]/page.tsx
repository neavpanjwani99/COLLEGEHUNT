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
      {/* Massive Hero Banner */}
      <div className="relative h-[280px] md:h-[360px] w-full bg-[#111827]">
        <img src={college.banner} alt={`${college.name} Campus`} className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-[1200px] px-6 pb-8 pt-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mb-6">
              <Link href="/colleges" className="hover:text-white transition-colors">Colleges</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-200">{college.name}</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 md:items-end">
              {/* Premium Floating Logo */}
              <div className="h-28 w-28 md:h-36 md:w-36 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white p-2 shadow-2xl relative z-10 translate-y-16">
                <img 
                  src={college.logo} 
                  alt={college.name} 
                  className="h-full w-full object-contain"
                />
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-[#006AFF] text-white font-semibold border-none">NIRF Rank #{college.nirfRank}</Badge>
                  <Badge className="bg-green-500/20 text-green-300 font-semibold border-green-500/30">{college.acreditation}</Badge>
                  <Badge className="bg-white/10 text-gray-300 font-semibold border-white/20">{college.type}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                  {college.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-5 text-[15px] font-medium text-gray-300">
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{college.city}, {college.state}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Est. {college.established}</span>
                  <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" />{college.streams[0]} Focus</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-w-[200px] pb-2">
                <Link href={college.website} target="_blank">
                  <Button className="w-full text-[15px] h-12 shadow-lg hover:shadow-xl transition-all bg-[#006AFF] text-white hover:bg-[#0056CC] border-none">
                    Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section padding top to account for floating logo */}
      <div className="bg-white pt-20 border-b border-[#E5E7EB] shadow-sm">
        <DetailTabs college={college} />
      </div>
    </div>
  );
}
