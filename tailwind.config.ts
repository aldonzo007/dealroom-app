import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a1628",
          800: "#111f36",
          700: "#1a2d4a",
        },
        gold: {
          light: "#F3E7C4",
          DEFAULT: "#C5A059",
          dark: "#8E6C2D",
        },
        cream: "#f5f1e8",
        forest: {
          50: "#f1f7f3",
          100: "#dcebe0",
          200: "#b9d6c3",
          500: "#2f7a4e",
          600: "#246139",
          700: "#1d4f2f",
          800: "#163b23",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
