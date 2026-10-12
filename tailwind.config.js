/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        // Softened from the brand navy (#02027C) so it sits quietly on the warm ivory ground.
        navy: { DEFAULT: '#273056', dark: '#1C2240', light: '#3A4472', brand: '#02027C' },
        oxblood: { DEFAULT: '#811000', dark: '#5E0C00' },                 // secondary accent, used sparingly
        gold: { DEFAULT: '#C9A227', soft: '#F3E9C9' },                    // decorative only on light grounds (2.2:1)
        // Supporting neutrals, warm and low-glare for comfortable reading
        ivory: '#F7F3EA',
        paper: '#FFFDF8',
        sand: { DEFAULT: '#EFE7D6', deep: '#E4D8BF' },
        brass: '#7D6210', // darker gold for any gold-toned text; 5.2:1 on ivory
        ink: { DEFAULT: '#2A2A33', soft: '#55545F' },
        line: '#E3DCCB',
        danger: '#B42318',
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Manrope Variable"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      maxWidth: { content: '80rem' },
      fontSize: {
        'display': ['clamp(2.25rem, 1.4rem + 3.6vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.875rem, 1.4rem + 1.9vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'h3': ['clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)', { lineHeight: '1.2' }],
      },
      borderRadius: { soft: '6px' },
    },
  },
  plugins: [],
};
