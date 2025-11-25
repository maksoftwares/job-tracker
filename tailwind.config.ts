import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f4f7ff",
          100: "#e9efff",
          200: "#d1dbff",
          500: "#3b5bdb",
          600: "#304cc0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
