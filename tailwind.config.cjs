
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#1e3a8a",   // blue-800
          DEFAULT: "#2563eb",// blue-600
          light: "#38bdf8",  // sky-400 (baby blue)
          aqua: "#22d3ee",   // cyan-400
          orchid: "#c084fc"  // violet-400
        }
      }
    },
  },
  plugins: [],
}
