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
        'bg-forge': '#0d0d0d',
        'bg-card': '#161616',
        'bg-border': '#252525',
        'forge-amber': '#e8863a',
        'forge-gold': '#c8a04a',
        'text-primary': '#f0f0f0',
        'text-secondary': '#707070',
        'text-muted': '#444444',
        'evidence-green': '#4a9e6f',
        'impulse-red': '#c24a3a',
        'xp-blue': '#4a7cc8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
