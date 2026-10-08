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
        // From design/tokens.json
        paper: {
          DEFAULT: "#FFFFFF",
          dark: "#111315",
        },
        "surface-2": {
          DEFAULT: "#F4F5F6",
          dark: "#1B1E21",
        },
        ink: {
          DEFAULT: "#14171A",
          dark: "#F4F5F6",
        },
        "ink-muted": {
          DEFAULT: "#5B6168",
          dark: "#A7ADB4",
        },
        line: {
          DEFAULT: "#9AA0A6",
          dark: "#5A6068",
        },
        "on-ink": {
          DEFAULT: "#FFFFFF",
          dark: "#14171A",
        },
        signal: {
          DEFAULT: "#E8590C",
          dark: "#F26B1D",
        },
        "signal-strong": {
          DEFAULT: "#C2410C",
          dark: "#FB8A3C",
        },
        "signal-soft": {
          DEFAULT: "#FDE7D9",
          dark: "#3A2416",
        },
        paid: {
          DEFAULT: "#15803D",
          dark: "#4ADE80",
          soft: "#DCFCE7",
          "soft-dark": "#12301D",
        },
        waiting: {
          DEFAULT: "#B45309",
          dark: "#F59E0B",
          soft: "#FEF3C7",
        },
        overdue: {
          DEFAULT: "#B91C1C",
          dark: "#F87171",
          soft: "#FEE2E2",
        },
      },
      fontFamily: {
        display: ['"Archivo"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      fontSize: {
        // From design/tokens.json type styles
        "amount-xl": ["36px", { lineHeight: "40px", fontWeight: "800" }],
        title: ["24px", { lineHeight: "30px", fontWeight: "700" }],
        heading: ["20px", { lineHeight: "26px", fontWeight: "700" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        button: ["17px", { lineHeight: "24px", fontWeight: "600" }],
        label: ["14px", { lineHeight: "20px", fontWeight: "600" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
      },
      spacing: {
        // From design/tokens.json spacing tokens
        1: "4px",
        2: "8px",
        4: "16px",
        6: "24px",
        8: "32px",
      },
      borderRadius: {
        // From design/tokens.json radius tokens
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      height: {
        // From design/tokens.json size tokens
        "tap-min": "48px",
        "tap-primary": "56px",
      },
      minHeight: {
        "tap-min": "48px",
        "tap-primary": "56px",
      },
    },
  },
  plugins: [],
};

export default config;
