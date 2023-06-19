/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{svelte,html,js,ts}"],
  theme: {
    fontFamily: {
      sans: ["IBM Plex Sans", "sans-serif"],
      display: ["Overpass", "ui-sans-serif"]
    },
    extend: {},
  },
  plugins: [require("daisyui")],
}

