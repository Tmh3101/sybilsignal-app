import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0b10",
        surface: "#14161f",
        accent: {
          cyan: "#00f2ff",
          red: "#ff1744",
          green: "#00e676",
        },
      },
      boxShadow: {
        "neo-convex": "8px 8px 16px #08090d, -8px -8px 16px #0c0d13",
        "neo-concave":
          "inset 8px 8px 16px #08090d, inset -8px -8px 16px #0c0d13",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
