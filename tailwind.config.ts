import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#FF385C",
        "brand-red": "#FF385C",
        "brand-red-hover": "#E31C5F",
        "brand-red-tint": "#FFF1F2",
        "brand-text-primary": "#222222",
        "brand-text-body": "#484848",
        "brand-text-muted": "#717171",
        "brand-border-light": "#DDDDDD",
        "brand-bg-soft": "#F7F7F7",
        "brand-blue": "#006AFF",
        "brand-blue-tint": "#EBF3FF",
        "brand-green": "#008A05",
        "brand-amber": "#8B5E00",
        "brand-error-red": "#C13515",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
