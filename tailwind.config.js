/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/*.{js,ts,tsx}', './app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        darkGreen: '#2B564D',
        lightGreen: '#C2D0BF',
        offWhite: '#F0EBE4',
        lightBrown: '#BFA187',
        darkBrown: '#78564D',
      },
    },
  },
  plugins: [],
};
