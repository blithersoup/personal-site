import createMDX from '@next/mdx'

let remotePatterns = [];
if (process.env.NODE_ENV !== 'development') {
  const imgHost = new URL(process.env.NEXT_PUBLIC_IMG_HOST);
  remotePatterns = [
    {
      protocol: 'https',
      hostname: imgHost.hostname,
      port: '',
      pathname: '/**',
    },
  ];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: remotePatterns,
  },
  async redirects() {
    return [
      {
        source: '/midi-5x8',
        destination: '/blog/post/midi-5x8',
        permanent: true,
      },
    ]
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