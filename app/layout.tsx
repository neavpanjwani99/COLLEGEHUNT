import "./globals.css";
import type { Metadata } from "next";
import { CompareProvider } from "@/context/CompareContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CollegeHunt.",
  description: "College decision platform for Indian students",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white">
        <ShortlistProvider>
          <CompareProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CompareProvider>
        </ShortlistProvider>
      </body>
    </html>
  );
}
