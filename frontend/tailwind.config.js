/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
    "./node_modules/@ferrucc-io/emoji-picker/dist/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}", // ← This line is crucial
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}