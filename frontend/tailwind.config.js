/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        verba: {
          bg: "#F8FAFC",       
          sidebar: "#FFFFFF", 
          accent: "#6366F1",   
          text: "#1E293B"     
        }
      }
    },
  },
  plugins: [],
}