/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#059669", // Premium Moss Green (Primary)
          90: "#1C1917", // Earthy Charcoal/Stone (Secondary Dark)
        },
        emerald: {
          50: "#f0fdf4", // Light Moss/Green 50
          100: "#dcfce7", // Light Moss/Green 100
          300: "#86efac", // Moss/Green 300
          400: "#4ade80", // Moss/Green 400
          500: "#10b981", // Emerald 500
          600: "#059669", // Emerald 600 (Hover)
          700: "#047857", // Emerald 700
          950: "#022c22", // Deep Forest Green 950
        },
        gray: {
          10: "#EEEEEE",
          20: "#A2A2A2",
          30: "#7B7B7B",
          50: "#585858",
          90: "#141414",
        },
        orange: {
          50: "#EA580C", // Terracotta Orange
        },
        blue: {
          70: "#021639",
        },
        yellow: {
          50: "#FEC601",
        },
        red: {
          viet: "#DA251D",
        },
      },
      backgroundImage: {
        "hero-vietnam":
          "url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1920&q=80')",
        "dest-ha-long":
          "url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80')",
        "dest-hoi-an":
          "url('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1200&q=80')",
        pattern: "url('/pattern.png')",
      },
      screens: {
        xs: "400px",
        "3xl": "1680px",
        "4xl": "2200px",
      },
      maxWidth: {
        "10xl": "1512px",
      },
      borderRadius: {
        "5xl": "40px",
      },
    },
  },
  plugins: [],
};
