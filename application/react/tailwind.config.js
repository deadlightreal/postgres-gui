/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main": "#7DCFB6",
        "secondary": "#EEE5E9",
      }
    },
  },
  plugins: [],
}

