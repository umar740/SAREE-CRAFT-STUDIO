/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2B2420",
        inksoft: "#5C5148",
        ivory: "#FBF7EF",
        ivorydeep: "#F3ECDD",
        wine: "#6E1E3C",
        winedark: "#4C1329",
        winesoft: "#9C3A5C",
        gold: "#B8923F",
        goldlight: "#E8D9AE",
        teal: "#1F4B4A",
        tealight: "#DCEAE8",
        line: "#E3D9C4",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        xl2: "14px",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(43,36,32,0.25)",
      },
      keyframes: {
        slidein: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        slidein: "slidein 0.25s ease",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  plugins: [],
}
