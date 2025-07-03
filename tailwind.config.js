/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.{js,jsx,ts,tsx}',
    './resources/views/**/*.blade.php',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
    },
  },
  plugins: [],
} 