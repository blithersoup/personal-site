import createMDX from '@next/mdx'
import { visit } from 'unist-util-visit';

const imgHost = new URL(process.env.NEXT_PUBLIC_IMG_HOST)
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: imgHost.hostname,
        port: '',
        pathname: '/**',
      },
    ],
  },
}

/** @type {import('rehype-pretty-code').Options} */
const rehype_code_options = {
  theme: "material-theme-palenight",
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ['remark-gfm', { strict: true, throwOnError: true }],
      ['remark-frontmatter', ['yaml'], { strict: true, throwOnError: true }],
      ['remark-mdx-frontmatter', { strict: true, throwOnError: true }],
    ],
    rehypePlugins: [['rehype-pretty-code', rehype_code_options, { strict: true, throwOnError: true }]],
  },
})

export default withMDX(nextConfig)