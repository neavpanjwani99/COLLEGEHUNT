import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight text-[#111827]">
              CollegeHunt<span className="text-[#006AFF]">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#6B7280]">
              The smartest way to discover, compare, and decide on your dream college in India. Make decisions based on data, not just marketing.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#111827]">Platform</h4>
            <ul className="mt-4 space-y-3 text-sm text-[#6B7280]">
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
          <div>
            <h4 className="font-semibold text-[#111827]">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-[#6B7280]">
              <li className="cursor-pointer transition-colors hover:text-[#006AFF]">Privacy Policy</li>
              <li className="cursor-pointer transition-colors hover:text-[#006AFF]">Terms of Service</li>
              <li className="cursor-pointer transition-colors hover:text-[#006AFF]">Data Sources</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#E5E7EB] pt-8 text-center text-sm text-[#9CA3AF]">
          © {new Date().getFullYear()} CollegeHunt. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
