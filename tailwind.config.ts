import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './mdx-components.tsx',
    './content/**/*.{md,mdx}',
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config;