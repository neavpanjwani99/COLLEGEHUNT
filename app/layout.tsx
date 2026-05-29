import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CompareProvider } from "@/context/CompareContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OnboardingModal } from "@/components/OnboardingModal";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CollegeHunt",
  description: "College decision platform for Indian students",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-white font-sans antialiased text-brand-text-body">
        <ShortlistProvider>
          <CompareProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <OnboardingModal />
          </CompareProvider>
        </ShortlistProvider>
      </body>
    </html>
  );
}
