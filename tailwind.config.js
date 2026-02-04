/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing blue theme (can be kept for admin or removed if not needed)
        blue: {
          '50': '#f0f5ff',
          '100': '#e5edff',
          '200': '#cddbfe',
          '300': '#b4c6fc',
          '400': '#8da2fb',
          '500': '#6366f1',
          '600': '#4f46e5',
          '700': '#4338ca',
          '800': '#3730a3',
          '900': '#2e3280',
          '950': '#1e224a',
        },
        // Magical Theme Colors
        mystic: {
          'DEFAULT': '#4a3f6d', // Deep purple
          'light': '#7b6fab',
          'dark': '#2c2a4a', // Very dark purple/blue
          'text': '#f0e8ff', // Light lavender text
        },
        starlight: {
          'DEFAULT': '#ffd700', // Gold
          'hover': '#ffe033',
          'subtle': '#fffacd', // Lemon chiffon for highlights
        },
        enchanted: {
          'forest': '#3a5a40', // Deep green
          'glow': '#80ffff',   // Aqua glow
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        magic: ['"Cinzel Decorative"', 'serif'], // A more thematic font for headings
        poppins: ['Poppins', 'sans-serif'], // Add Poppins font
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sparkle': 'sparkle 3s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        }
      },
      backgroundImage: {
        'magic-sky': "url('../src/assets/magic_sky_bg.jpg')", // Corrected path
        'enchanted-forest': "url('../src/assets/enchanted_forest_bg.jpg')", // Corrected path
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
