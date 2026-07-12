import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1F2A44",
        mist: "#EDF4FF",
        cloud: "#F8FAFF",
        sky: "#DCEBFF",
        lavender: "#E9E2FF",
        lilac: "#D8CBFF",
        line: "#D9E3F3"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(114, 146, 190, 0.14)",
        card: "0 16px 40px rgba(113, 133, 164, 0.12)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(216, 203, 255, 0.55), transparent 35%), radial-gradient(circle at bottom right, rgba(220, 235, 255, 0.8), transparent 40%)"
      }
    }
  },
  plugins: []
};

export default config;
