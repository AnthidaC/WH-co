import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff385c", // Rausch - Single Accent Voltage
          active: "#e00b41",
          disabled: "#ffd1da",
          subtle: "#fff0f3",
        },
        ink: {
          DEFAULT: "#222222", // Deep Ink instead of pure black
          body: "#3f3f3f",
          muted: "#6a6a6a",
          soft: "#929292",
        },
        hairline: {
          DEFAULT: "#dddddd",
          soft: "#ebebeb",
          strong: "#c1c1c1",
        },
        canvas: "#ffffff",
        surface: {
          soft: "#f7f7f7",
          card: "#ffffff",
          strong: "#f2f2f2",
        },
        status: {
          available: "#ffffff",
          held: "#fef3c7",
          heldBorder: "#f59e0b",
          heldText: "#92400e",
          booked: "#f2f2f2",
          bookedText: "#929292",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "20px",
        full: "9999px",
      },
      boxShadow: {
        float: "rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0",
        soft: "0 2px 10px rgba(0,0,0,0.04)",
      },
      lineHeight: {
        relaxed: "1.6",
        loose: "1.8",
      },
      fontFamily: {
        sans: ["var(--font-prompt)", "var(--font-ibm-plex-sans-thai)", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
