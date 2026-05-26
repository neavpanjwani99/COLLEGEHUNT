import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#FF385C",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
