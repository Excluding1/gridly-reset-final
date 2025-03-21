export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'dot-grid-light': "radial-gradient(#ccc 1px, transparent 1px)",
        'dot-grid-dark': "radial-gradient(#444 1px, transparent 1px)"
      },
      backgroundSize: {
        'dot': '20px 20px'
      }
    },
  },
  plugins: [],
};