/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0056b3',
        'primary-light': '#007bff',
        'primary-dark': '#003d82',
      },
    },
  },
  plugins: [],
}