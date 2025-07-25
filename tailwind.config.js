/** @type {import('tailwindcss').Config} */
    module.exports = {
      darkMode: ['class'],
      content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
      ],
      theme: {
        container: {
          center: true,
          padding: '2rem',
          screens: {
            '2xl': '1400px',
          },
        },
        extend: {
          colors: {
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            background: 'hsl(var(--background))', 
            foreground: 'hsl(var(--foreground))',
            primary: {
              DEFAULT: 'hsl(var(--primary))', 
              foreground: 'hsl(var(--primary-foreground))',
            },
            secondary: {
              DEFAULT: 'hsl(var(--secondary))', 
              foreground: 'hsl(var(--secondary-foreground))', 
            },
            destructive: {
              DEFAULT: 'hsl(var(--destructive))',
              foreground: 'hsl(var(--destructive-foreground))',
            },
            muted: {
              DEFAULT: 'hsl(var(--muted))',
              foreground: 'hsl(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'hsl(var(--accent))', 
              foreground: 'hsl(var(--accent-foreground))',
            },
            popover: {
              DEFAULT: 'hsl(var(--popover))',
              foreground: 'hsl(var(--popover-foreground))',
            },
            card: {
              DEFAULT: 'hsl(var(--card))',
              foreground: 'hsl(var(--card-foreground))',
            },
            turquoise: {
              light: '#A0E7E5',
              DEFAULT: '#40E0D0',
              dark: '#00C9B1',
            },
            sandy: {
              light: '#FDF0E0',
              DEFAULT: '#F5E6CC',
              dark: '#EED9B9',
            },
          },
          borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
          },
          keyframes: {
            'accordion-down': {
              from: { height: 0 },
              to: { height: 'var(--radix-accordion-content-height)' },
            },
            'accordion-up': {
              from: { height: 'var(--radix-accordion-content-height)' },
              to: { height: 0 },
            },
            'slide-in': {
              from: { transform: 'translateY(20px)', opacity: 0 },
              to: { transform: 'translateY(0)', opacity: 1 },
            },
            'fade-in': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            }
          },
          animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
            'slide-in': 'slide-in 0.5s ease-out forwards',
            'fade-in': 'fade-in 0.5s ease-out forwards',
          },
        },
      },
      plugins: [require('tailwindcss-animate')],
    };