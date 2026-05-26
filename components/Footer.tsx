import Link from "next/link";
import Image from "next/image";
import logoImg from "@/app/images/Logo.png";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white pt-16 pb-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-6">
          <div className="max-w-md">
            <Link href="/" className="flex items-center">
              <Image src={logoImg} alt="CollegeHunt" height={40} className="object-contain h-10 w-auto animate-none" />
            </Link>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6B7280]">
              The smartest way to discover, compare, and decide on your dream college in India. Make decisions based on data, not just marketing.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            <div className="min-w-[120px]">
              <h4 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">Platform</h4>
              <ul className="mt-4 space-y-3 text-[14px] text-[#6B7280]">
                <li>
                  <Link href="/colleges" className="transition-colors hover:text-[#006AFF]">
                    Browse Colleges
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="transition-colors hover:text-[#006AFF]">
                    Smart Compare
                  </Link>
                </li>
                <li>
                  <Link href="/shortlist" className="transition-colors hover:text-[#006AFF]">
                    My Shortlist
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="min-w-[120px]">
              <h4 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">Legal</h4>
              <ul className="mt-4 space-y-3 text-[14px] text-[#6B7280]">
                <li className="cursor-pointer transition-colors hover:text-[#006AFF]">Privacy Policy</li>
                <li className="cursor-pointer transition-colors hover:text-[#006AFF]">Terms of Service</li>
                <li className="cursor-pointer transition-colors hover:text-[#006AFF]">Data Sources</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-[#E5E7EB] pt-8 flex flex-col md:flex-row md:justify-between items-center gap-4 text-sm text-[#9CA3AF]">
          <div>
            © {new Date().getFullYear()} CollegeHunt. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-[#111827]">India Edition</span>
            <span className="cursor-pointer hover:text-[#111827]">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
