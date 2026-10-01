import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        background: "#000000",
        surface: {
          DEFAULT: "#0E1422",
          subtle: "#121A2D",
          panel: "#152037",
          hover: "#1A2744",
        },
        border: {
          DEFAULT: "#1E2C44",
          subtle: "#162238",
          strong: "#2B3F63",
        },
        quantum: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#00F0FF",
          600: "#00C4D6",
          700: "#0891B2",
          800: "#155E75",
          900: "#164E63",
        },
        violet: {
          quantum: "#8B5CF6",
          dark: "#5B21B6",
        },
        status: {
          secure: "#10B981",
          warning: "#F59E0B",
          attack: "#EF4444",
          info: "#00F0FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "glow-cyan": {
          "0%, 100%": { filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.4))" },
          "50%": { filter: "drop-shadow(0 0 16px rgba(0, 240, 255, 0.7))" },
        },
        "glow-red": {
          "0%, 100%": { filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))" },
          "50%": { filter: "drop-shadow(0 0 16px rgba(239, 68, 68, 0.7))" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan-line 6s linear infinite",
        "glow-cyan": "glow-cyan 2.5s ease-in-out infinite",
        "glow-red": "glow-red 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
