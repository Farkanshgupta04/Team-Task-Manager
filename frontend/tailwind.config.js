export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5fbff',
          100: '#e6f3ff',
          500: '#2563eb',
          700: '#1e40af'
        },
        accent: {
          400: '#7c3aed'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      }
    }
  },
  plugins: [],
}
