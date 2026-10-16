/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        hinge: {
          bg: "#FAF8F5",
          paper: "#FFFFFF",
          canvas: "#F4F1EA",
          burgundy: "#711A31",
          deep: "#541223",
          plum: "#6E1A34",
          rose: "#E11D48",
          blush: "#FFF1F2",
          stone: "#1C1917",
          muted: "#78716C",
          border: "#E7E5E4",
          teal: "#0B6B67",
          tealHover: "#085552",
          mauve: "#BEA8BE",
          pillActive: "#ECE5E8",
          peachWash: "#FDEAE6",
        },
        nearme: {
          dark: "#1C1917",
          card: "#FFFFFF",
          accent: "#711A31",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        gloss: "0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 8px -2px rgba(0, 0, 0, 0.03)",
        "gloss-lg": "0 20px 45px -10px rgba(113, 26, 49, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
        "gloss-inner": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)",
        "hinge-nav": "0 10px 35px -5px rgba(0, 0, 0, 0.08), 0 2px 10px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
