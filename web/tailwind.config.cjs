module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff8c42',
        surface: 'rgba(22, 26, 35, 0.75)',
        'surface-strong': 'rgba(22, 26, 35, 0.95)'
      },
      fontFamily: {
        display: ['"Rajdhani"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 30px rgba(255, 140, 66, 0.35)'
      },
      backgroundImage: {
        starfield:
          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0, transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.15) 0, transparent 35%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.1) 0, transparent 45%), linear-gradient(135deg, #0b1020, #03050f)'
      }
    }
  },
  plugins: []
};
