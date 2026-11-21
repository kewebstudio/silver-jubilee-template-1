
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Cormorant Garamond", "serif"],
        script: ["Great Vibes", "cursive"],
        body: ["Montserrat", "sans-serif"],
      },
      colors: {
        silver: "#C8C4C5",
        pearl: "#FFF9F4",
        champagne: "#D6B477",
        charcoal: "#252128",
      },
    },
  },
  plugins: [],
};