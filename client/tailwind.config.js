/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    fontFamily: {
      'logo': ["ChessLogo"]
    },
    extend: {},
  },
  plugins: [
      require('@tailwindcss/forms'),
  ],
})

