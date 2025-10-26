const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: '#1F6FEB',
        secondary: '#58A6FF',
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: '#1E293B',
        muted: '#64748B',
        border: '#E2E8F0',
      },
      boxShadow: {
        soft: '0 4px 30px rgba(0,0,0,0.06)',
        card: '0 8px 24px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.text-glow': { textShadow: '0 0 6px rgba(88,166,255,.8)' },
      });
    }),
  ],
};
