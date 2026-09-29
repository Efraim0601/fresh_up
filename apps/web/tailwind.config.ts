import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    // Design mobile first : viewport de depart 360px, gros boutons.
    extend: {
      colors: {
        brand: {
          DEFAULT: "#8a3b2e",
          light: "#c96f4c",
          dark: "#5c261d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
