/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './templates/**/*.json',
  ],
  // Safelist: classes used in Shopify article body_html (dynamic content Tailwind can't scan)
  safelist: [
    'align-super', 'bg-\\[hsl\\(var\\(--secondary\\)\\)\\]', 'block', 'border-b',
    'border-collapse', 'border-foreground/10', 'border-foreground/20', 'border-t',
    'break-all', 'flex', 'font-light', 'font-medium', 'font-sans', 'font-serif',
    'gap-4', 'gap-6', 'gap-8', 'grid', 'grid-cols-1', 'group', 'group-hover:opacity-60',
    'hover:opacity-60', 'hover:text-foreground', 'justify-center', 'leading-relaxed',
    'leading-snug', 'leading-tight', 'list-decimal', 'list-inside', 'mb-1', 'mb-2',
    'mb-4', 'mb-6', 'md:gap-12', 'md:grid-cols-2', 'md:grid-cols-\\[1fr_1\\.5fr\\]',
    'md:p-8', 'md:text-3xl', 'my-12', 'no-underline', 'p-6', 'pr-4', 'px-4', 'py-3',
    'py-8', 'self-center', 'space-y-2', 'space-y-3', 'space-y-4', 'space-y-6',
    'space-y-8', 'text-2xl', 'text-base', 'text-center', 'text-foreground',
    'text-foreground/90', 'text-left', 'text-lg', 'text-muted-foreground',
    'text-muted-foreground/60', 'text-muted-foreground/70', 'text-sm', 'text-xl',
    'text-xs', 'tracking-\\[0\\.15em\\]', 'tracking-\\[0\\.1em\\]', 'tracking-\\[0\\.2em\\]',
    'tracking-tight', 'tracking-wide', 'transition-colors', 'transition-opacity',
    'underline', 'underline-offset-2', 'underline-offset-4', 'uppercase', 'w-full',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['EB Garamond', 'Georgia', 'serif'],
      },
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
        diagram: 'hsl(var(--diagram))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
