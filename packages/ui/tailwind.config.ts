import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../apps/client/src/**/*.{ts,tsx}',
    '../../apps/admin/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F15A24', // Orange-rouge principal (couleur exacte du design)
          dark: '#C94A1C',   // Hover / états actifs
          light: '#FF7A45',  // Accents clairs
        },
        secondary: {
          DEFAULT: '#1E3A5F', // Bleu marine — couleur complémentaire de l'orange
          dark: '#142844',   // Hover / états actifs
          light: '#2A5080',  // Accents clairs
        },
        accent: {
          DEFAULT: '#F5A623', // Jaune doré — badges "NEW", "HOT", timers
          dark: '#D4891A',
        },
        bg: {
          DEFAULT: '#FFFFFF',
          subtle: '#F5F5F5',
          dark: '#1A1A1A',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#555555',
          muted: '#999999',
          inverse: '#FFFFFF',
        },
        price: {
          DEFAULT: '#F15A24', // Prix en orange-rouge
          old: '#999999',
        },
        success: '#00A651',
        warning: '#F5A623',
        error: '#E53935',
        info: '#0066CC',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.15)',
        // Aliases rétrocompatibles
        worten: '0 1px 3px rgba(0,0,0,0.1)',
        'worten-hover': '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
