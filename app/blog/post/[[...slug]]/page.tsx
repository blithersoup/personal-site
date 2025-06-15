import { promises as fs } from 'fs'
import Link from 'next/link'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { Metadata } from 'next'

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string[] }>
  }) {
    const { slug } = await params

    const { default: Post } = await import(`@/content/${slug.join('/')}.mdx`)
   
    const backLink = slug.length === 1 
      ? '/' 
      : `/blog/folder/${slug[0]}`

    return (
      <div className="xl:ml-[calc(18%-6rem)] xl:mr-[calc(18%-6rem)] xl:w-[74%] font-main">
        <Link 
          href={backLink}
          className="flex items-center mb-6 text-sm group no-underline"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1 text-[var(--accent-1)]" />
          <span className="group-hover:underline">
            {slug.length === 1 ? 'Back to homepage' : 'Back to folder'}
          </span>
        </Link>
        <article className="prose prose-lg dark:prose-invert max-w-none pb-4"> 
          <Post />
        </article>
      </div>
    )
  }

export async function generateStaticParams() {
  const entries = await fs.readdir(process.cwd() + '/content', { withFileTypes: true });
  
  const baseFiles: string[] = entries
    .filter((dirent) => !dirent.isDirectory())
    .map((dirent) => dirent.name.replace(/\.mdx$/, ''));

  const folders = entries.filter((dirent) => dirent.isDirectory());

  const nestedFiles = await Promise.all(folders.map(async (dirent) => {
    const nestedFileNames = await fs.readdir(process.cwd() + '/content/' + dirent.name)
    const nestedFilesFiltered = nestedFileNames
      .filter((file) => file !== '_index.mdx')
      .map((file) => dirent.name + '/' + file.replace(/\.mdx$/, '')
    );
    return nestedFilesFiltered
  }))

  const fullList = [...baseFiles, ...nestedFiles.flat()]
  
  return fullList.map((slug) => ({ slug: slug.split("/") }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const { frontmatter } = await import(`@/content/${slug.join('/')}.mdx`)

  return {
    title: frontmatter.title,
    description: `${new Date(frontmatter.date).toLocaleDateString()} - ${frontmatter.title} - gradyarnold.com`,
    openGraph: {
      title: frontmatter.title,
      description: `${new Date(frontmatter.date).toLocaleDateString()} - ${frontmatter.title} - gradyarnold.com`,
      url: `https://gradyarnold.com/blog/post/${slug.join('/')}`,
      type: 'article',
      publishedTime: frontmatter.date
    },
  }
}
