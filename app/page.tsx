import Link from "next/link";
import { ArrowRight, BarChart3, Search, Sparkles, SlidersHorizontal } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

const highlights = [
  {
    title: "Discover faster",
    text: "Search by stream, city, type, and fees to shortlist in under a minute.",
    icon: Search,
  },
  {
    title: "Compare properly",
    text: "Use the weight sliders to rank colleges by what matters to you.",
    icon: SlidersHorizontal,
  },
  {
    title: "Decide with confidence",
    text: "Open a detail page with placements, cutoffs, reviews, and admission chances.",
    icon: BarChart3,
  },
];

const routes = [
  { href: "/colleges", title: "Browse colleges", text: "Search and filter the full catalog." },
  { href: "/compare", title: "Open compare tool", text: "Rank up to 3 colleges with live scoring." },
  { href: "/shortlist", title: "View shortlist", text: "See everything you’ve saved so far." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className="border-b border-[#E5E7EB]">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 pt-10 pb-16 md:grid-cols-[1.2fr_0.8fr] md:pt-12 md:pb-20">
            <div className="max-w-2xl">
              <Badge className="bg-[#FFF0F2] text-[#FF385C] border-transparent font-bold rounded-full px-3.5 py-1">College discovery, simplified</Badge>
              <h1 className="mt-6 text-5xl font-bold tracking-[-0.03em] text-[#222222] md:text-6xl">
                Find, compare, and choose the right college.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#717171] font-medium">
                CollegeHunt helps students move from confusion to a confident decision with search, shortlist, comparison, and detail views built for real choices.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/colleges">
                  <Button className="h-12 px-6 rounded-full bg-[#FF385C] hover:bg-[#E61E4D]">
                    Start browsing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="secondary" className="h-12 px-6 rounded-full border-gray-200 text-[#222222]">
                    Open compare tool
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="p-8 rounded-2xl border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#717171]">
                <Sparkles className="h-4 w-4 text-[#FF385C]" />
                Why it feels different
              </div>
              <div className="mt-6 space-y-4">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-gray-100 p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF0F2] text-[#FF385C] shrink-0">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#222222]">{item.title}</div>
                        <div className="mt-1 text-sm leading-6 text-[#717171] font-medium">{item.text}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="border-b border-[#E5E7EB]">
          <div className="mx-auto max-w-[1200px] px-6 py-16">
            <div className="mb-8">
              <div className="text-xs font-semibold uppercase tracking-[0.04em] text-[#717171]">Navigation</div>
              <h2 className="mt-3 text-3xl font-bold text-[#222222]">Jump into the product</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {routes.map((route) => (
                <Link key={route.href} href={route.href}>
                  <Card className="h-full p-6 rounded-2xl hover:shadow-md transition-shadow border-gray-200">
                    <div className="text-lg font-bold text-[#222222]">{route.title}</div>
                    <p className="mt-2 text-sm leading-6 text-[#717171] font-medium">{route.text}</p>
                    <div className="mt-6 inline-flex items-center text-sm font-bold text-[#FF385C]">
                      Open
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
