import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.weserv.nl" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
    unoptimized: true, // Use this for maximum reliability on static exports/CDNs
  },
};

export default nextConfig;
