# personal-site

![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/blithersoup/personal-site)

Simple portfolio website made with Next.js in TypeScript.  Hosted at [gradyarnold.com](https://gradyarnold.com).

## To use

### Install

```bash
npm i
```

To start-

```bash
# development
npm run dev
```

```bash
# production
npm run build
npm run start
```

### Environment variables

`NEXT_PUBLIC_IMG_HOST`: Base URL of image host (must begin with `https://`), or name of directory 
within `/public` (starting with '/', ex. `/public/pics` should be `/pics`)

## Making of

I wrote the first version of this blog a couple years ago and had been meaning 
to rewrite it.  After some searching, I landed on the same stack but using 
remark-rehype for my content management. My requirement was to have automatic 
folder support and component overrides for images and rows.  The latter was why 
I chose not to use markdown in the first place, although admittedly I did not do 
much research.

For folder support I decided to create a homepage that would link to the top level 
posts and folders, a folder route that would render all folders, and a post route that 
renders all posts.  I have frontmatter at the top of each post that displays title 
and date on the card for the enclosing folder or main page.  I also have an _index.mdx 
file in each folder that contains both the content of the folder header and the 
frontmatter for the folder.

## Styling

I used tailwindcss for styling with tailwindcss-typography for the blog.  I searched google 
fonts for fonts that I liked and ended up with Castoro for headers and Archivo for body.  I 
picked a navy background with off white text, lighter blue accents, and pink highlighting.
For spacing on the main content I set side margins and widths as a percentage of viewport 
width.

## MDX support

First I configured next to use MDX imports.  I picked the code formatting theme to 
work well with my color scheme and copied the file header formatting from examples in 
the docs.

```js title="next.config.mjs"
import createMDX from '@next/mdx'

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
```

Each file can be imported like below:

```js
const { default: Post, frontmatter } = await import(`@/content/${slug.join('/')}.mdx`)
```

## Images and rows

I first wanted to modify the image component in markdown, but ended up using a custom 
component.

```tsx title="mdx-components.tsx"
export const Img: React.FC<ImgProps> = ({ 
  src, 
  alt, 
  caption,
  priority = false
}) => {
  return (
    <div className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33%-16px)] lg:w-[calc(25%-22px)] mb-6">
      <div className="aspect-square relative overflow-hidden rounded-md shadow-lg">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMG_HOST}/${src}`}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>
      {caption && (
        <p className="mt-2 text-sm text-center">{caption}</p>
      )}
    </div>
  );
};

export const Row: React.FC<RowProps> = ({ children, desc }) => {
  return (
    <div className="w-full my-8">
      <div className="flex flex-wrap mx-auto justify-center items-start gap-6">
        {children}
      </div>
      {desc && (
        <p className="mt-3 text-md text-center">{desc}</p>
      )}
    </div>
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Img,
    Row,
    
    ...components,
  }
}
```

This uses the same logic as my old site but does not overflow the outer 
element.  It has the same mechanism as before for sizing where the image 
outer container size is determined absolutely by viewport size and the image 
component fills that outer container.