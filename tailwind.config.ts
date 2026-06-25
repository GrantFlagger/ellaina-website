import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C4A1E",
          50:  "#E8F0E4",
          100: "#C9DABC",
          200: "#A8C292",
          300: "#87AA68",
          400: "#6E9649",
          500: "#2C4A1E",
          600: "#264219",
          700: "#1E3413",
          800: "#16260D",
          900: "#0E1807",
        },
        secondary: {
          DEFAULT: "#C8A96E",
          50:  "#FAF5EB",
          100: "#F1E4C5",
          200: "#E7D09D",
          300: "#DCBC75",
          400: "#D4AF5A",
          500: "#C8A96E",
          600: "#B8923F",
          700: "#9A7A34",
          800: "#7C6229",
          900: "#5E4A1E",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          dark:   "#EAE4D5",
        },
        bark: {
          DEFAULT: "#3D2B1F",
          light:   "#5A3F30",
          dark:    "#261A12",
        },
        light: "#EAE4D5",
        // Dark-mode surface palette
        night: {
          DEFAULT: "#0F1809",
          surface: "#141F0B",
          subtle:  "#1A2812",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body:    ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
