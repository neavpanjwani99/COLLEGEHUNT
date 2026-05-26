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
          <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-24">
            <div className="max-w-2xl">
              <Badge className="bg-[#EFF6FF] text-[#006AFF]">College discovery, simplified</Badge>
              <h1 className="mt-6 text-5xl font-bold tracking-[-0.03em] text-[#111827] md:text-6xl">
                Find, compare, and choose the right college.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#374151]">
                CollegeHunt helps students move from confusion to a confident decision with search, shortlist, comparison, and detail views built for real choices.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/colleges">
                  <Button className="h-12 px-6">
                    Start browsing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/compare">
                  <Button variant="secondary" className="h-12 px-6">
                    Open compare tool
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="p-8">
              <div className="flex items-center gap-3 text-sm font-medium text-[#6B7280]">
                <Sparkles className="h-4 w-4 text-[#006AFF]" />
                Why it feels different
              </div>
              <div className="mt-6 space-y-4">
                {highlights.map((item) => (
                  <div key={item.title} className="rounded-xl border border-[#E5E7EB] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#006AFF]">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#111827]">{item.title}</div>
                        <div className="mt-1 text-sm leading-6 text-[#6B7280]">{item.text}</div>
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
              <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#6B7280]">Navigation</div>
              <h2 className="mt-3 text-3xl font-semibold text-[#111827]">Jump into the product</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {routes.map((route) => (
                <Link key={route.href} href={route.href}>
                  <Card className="h-full p-6">
                    <div className="text-lg font-semibold text-[#111827]">{route.title}</div>
                    <p className="mt-2 text-sm leading-6 text-[#6B7280]">{route.text}</p>
                    <div className="mt-6 inline-flex items-center text-sm font-medium text-[#006AFF]">
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
