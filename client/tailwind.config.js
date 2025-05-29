/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#016937',
        accent: {
          orange: '#ed7824',
          yellow: '#ebab21',
        },
        background: '#f5f5f5',
      },
    },
  },
  plugins: [],
};
