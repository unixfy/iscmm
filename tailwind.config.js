/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{svelte,html,js,ts}"],
    theme: {
        fontFamily: {
            sans: ["IBM Plex Sans", "sans-serif"],
            display: ["Overpass", "ui-sans-serif"]
        },
        extend: {
            colors: {
                'mutcd-black': "#000000",
                'mutcd-white': "#ffffff",
                'mutcd-green': "#006b54",
                'mutcd-blue': "#003f87",
                'mutcd-yellow': "#fcd116",
                'mutcd-red': "#af1e2d",
                'mutcd-orange': "#dd7500",
            }
        },
    },
    plugins: [require("daisyui")],
}

