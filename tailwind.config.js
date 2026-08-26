/**
 * Tailwind maps onto CSS custom properties defined in src/index.css rather than
 * holding the values itself. That indirection is what lets the accessibility
 * panel switch contrast, text size and Data Saver at runtime by flipping one
 * attribute on <html>, without a second stylesheet or a rebuild.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          0: 'var(--paper-0)',
          1: 'var(--paper-1)',
          2: 'var(--paper-2)',
          3: 'var(--paper-3)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          faint: 'var(--ink-faint)',
        },
        indigo: {
          900: 'var(--indigo-900)',
          DEFAULT: 'var(--indigo)',
          600: 'var(--indigo-600)',
          50: 'var(--indigo-050)',
        },
        terracotta: {
          DEFAULT: 'var(--terracotta)',
          ink: 'var(--terracotta-ink)',
          50: 'var(--terracotta-050)',
        },
        peacock: { DEFAULT: 'var(--peacock)', 50: 'var(--peacock-050)' },
        gold: 'var(--gold)',
        rule: {
          DEFAULT: 'var(--rule)',
          strong: 'var(--rule-strong)',
          control: 'var(--rule-control)',
        },
        info: { DEFAULT: 'var(--info)', bg: 'var(--info-bg)' },
        success: { DEFAULT: 'var(--success)', bg: 'var(--success-bg)' },
        warning: { DEFAULT: 'var(--warning)', bg: 'var(--warning-bg)' },
        danger: { DEFAULT: 'var(--danger)', bg: 'var(--danger-bg)' },
        'on-indigo': { DEFAULT: 'var(--on-indigo)', muted: 'var(--on-indigo-muted)' },
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-sans)',
      },
      fontSize: {
        // Paired with line-height and tracking so a size is never used naked.
        'display-xl': ['var(--fs-display-xl)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
        'display-l': ['var(--fs-display-l)', { lineHeight: '1.08', letterSpacing: '-0.016em' }],
        'display-m': ['var(--fs-display-m)', { lineHeight: '1.15', letterSpacing: '-0.010em' }],
        title: ['var(--fs-title)', { lineHeight: '1.25', letterSpacing: '-0.005em' }],
        heading: ['var(--fs-heading)', { lineHeight: '1.35' }],
        subhead: ['var(--fs-subhead)', { lineHeight: '1.45' }],
        lede: ['var(--fs-lede)', { lineHeight: '1.55', letterSpacing: '-0.003em' }],
        body: ['var(--fs-body)', { lineHeight: '1.60' }],
        meta: ['var(--fs-meta)', { lineHeight: '1.50', letterSpacing: '0.005em' }],
        label: ['var(--fs-label)', { lineHeight: '1.30', letterSpacing: '0.010em' }],
        overline: ['var(--fs-overline)', { lineHeight: '1.20', letterSpacing: '0.14em' }],
        data: ['var(--fs-data)', { lineHeight: '1.40', letterSpacing: '0.06em' }],
      },
      spacing: {
        1: 'var(--s-1)', 2: 'var(--s-2)', 3: 'var(--s-3)', 4: 'var(--s-4)',
        5: 'var(--s-5)', 6: 'var(--s-6)', 7: 'var(--s-7)', 8: 'var(--s-8)',
        9: 'var(--s-9)', 10: 'var(--s-10)', 11: 'var(--s-11)', 12: 'var(--s-12)',
        gutter: 'var(--gutter)',
        // Touch-target floor. Used as min-height/min-width, never as padding.
        touch: '44px',
      },
      maxWidth: {
        prose: 'var(--w-prose)',
        form: 'var(--w-form)',
        doc: 'var(--w-doc)',
        dashboard: 'var(--w-dashboard)',
        shell: 'var(--w-max)',
      },
      borderWidth: { hair: '1px', emph: '2px', rail: '3px' },
      borderRadius: { none: '0', DEFAULT: '2px', control: '2px' },
      boxShadow: { none: 'none', raise: 'var(--sh-raise)', lift: 'var(--sh-lift)' },
      transitionDuration: {
        quick: 'var(--dur-quick)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },
      transitionTimingFunction: { out: 'var(--ease-out)', standard: 'var(--ease-in-out)' },
    },
  },
  plugins: [],
};
