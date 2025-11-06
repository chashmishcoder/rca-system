/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#0f172a',
          800: '#1e293b',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-gradient-to-br',
    'from-slate-900',
    'via-purple-900',
    'to-slate-900',
    'from-blue-500',
    'to-purple-600',
    'from-blue-400',
    'via-purple-400',
    'to-pink-400',
    {
      pattern: /(bg|text|border)-(blue|purple|pink|green|orange|red|slate)-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
}
