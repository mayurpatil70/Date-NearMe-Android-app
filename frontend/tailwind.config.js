/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nearme: {
          dark: "#121212",
          card: "#1c1c1c",
          accent: "#8b5cf6", // A premium purple accent
        },
      },
    },
  },
  plugins: [],
};
