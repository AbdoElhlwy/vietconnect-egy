import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        vn: {
          red: "#DA251D",
          gold: "#FFCD00"
        },
        diplomatic: {
          navy: "#0B2545",
          navyLight: "#13315C",
          slate: "#8DA9C4",
          fog: "#EEF4ED"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Tahoma", "sans-serif"],
        arabic: ["var(--font-cairo)", "Tahoma", "sans-serif"]
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      boxShadow: {
        diplomatic: "0 8px 30px rgba(11,37,69,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
