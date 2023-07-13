/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      textColor: {
        primary: '#000',
        regular: '#222',
        secondary: '#555'
      },
      backgroundColor: {
        mdBlockQuote: '#f7f5fe'
      },
      borderColor: {
        mdBlockQuote: '#9e65e3'
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
