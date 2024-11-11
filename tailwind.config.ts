import type { Config } from 'tailwindcss';

const language = {
  html: '#e34c26',
  css: '#563d7c',
  js: '#f1e05a',
  jsx: '#f1e05a',
  ts: '#3178c6',
  tsx: '#3178c6',
  shell: '#89e051',
  yaml: '#cb171e',
  json: '#cb171e',
  sql: '#e38c00',
  c: '#a8b9cc',
  cpp: '#f34b7d',
  text: '#808080',
};

const config: Config = {
  content: ['./src/components/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}', './src/lib/**/*.{ts,tsx}'],
  safelist: [{ pattern: new RegExp(Object.keys(language).join('|')) }],
  theme: {
    fontFamily: {
      sans: ['var(--font-pretendard)', 'sans-serif'],
      mono: ['var(--font-jetbrains)', 'consolas'],
    },
    extend: {
      colors: {
        light: {
          DEFAULT: '#dddddd',
          mute: '#595959',
          link: '#004ec7',
          background: '#eef1f5',
          line: '#e5e7eb',
        },
        dark: {
          DEFAULT: '#191c1f',
          mute: '#b3b3b3',
          link: '#10b981',
          background: '#222527',
          line: '#3a3e42',
        },
        dimmed: '#00000066',
        language,
      },
      screens: {
        xs: '480px',
      },
      animation: {
        flip: 'flip 1s linear infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
    },
  },
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [],
} satisfies Config;

export default config;
