/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
     "./src/**/*.{js,jsx,ts,tsx}",
   ],
   theme: {
     extend: {
       fontFamily: {
         cursive: ['"Dancing Script"', 'cursive'],
         mono: ['"Courier Prime"', 'monospace'],
       },
     },
   },
   plugins: [],
 }
 