import fs from "fs/promises"
import path from "path"
import { ContentListItem } from "@/components/ContentListItem"
import { BackButton } from "@/components/BackButton"
import { Metadata } from 'next'

export default async function Page({ params }:
    { params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const contentDir = path.join(process.cwd(), "content", slug)
  const files = await fs.readdir(contentDir).then(
    (files) => files.filter(file => file.endsWith('.mdx') && file !== "_index.mdx")
  )
  const posts = await Promise.all(
    files.map(async (fileName) => {
      const postSlug = fileName.replace(/\.mdx$/, "")
      
      const { frontmatter } = await import(`@/content/${slug}/${fileName}`)
      
      return {
        slug: `${slug}/${postSlug}`,
        frontmatter
      }
    })
  )

  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
  
  const { default: FolderHead } = await import(`@/content/${slug}/_index.mdx`)

  return (
    <div>
    <div className="lg:ml-[20%] lg:w-[55%] mb-12 font-main">
      <BackButton href="/" text="Back to homepage" />
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <FolderHead />
      </div>
      </div>
      <div className="space-y-6 mt-8 lg:ml-[calc(25%-4rem)]">
        {sortedPosts.map((post) => (
            <ContentListItem
              key={post.slug}
              item={{
                slug: post.slug,
                frontmatter: post.frontmatter,
              }}
            />
          ))}
      </div>
      </div>

  )
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "content")
  const folder_dirents = await fs.readdir(contentDir, { withFileTypes: true })
  
  const folders = folder_dirents
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
  
  return folders.map(folder => ({
    slug: folder
  }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata> {
  const { slug } = params
  const { frontmatter } = await import(`@/content/${slug}/_index.mdx`)

  return {
    title: frontmatter.title,
    description: `${new Date(frontmatter.date).toLocaleDateString()} - ${frontmatter.title} - gradyarnold.com`,
    openGraph: {
      title: frontmatter.title,
      description: `${new Date(frontmatter.date).toLocaleDateString()} - ${frontmatter.title} - gradyarnold.com`,
      url: `https://gradyarnold.com/blog/folder/${slug}`,
      type: 'article',
      publishedTime: frontmatter.date
    },
  }
}
