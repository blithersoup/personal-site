import fs from "fs/promises"
import path from "path"
import { ContentListItem, ContentListItemProps } from "@/components/ContentListItem"

export default async function Home() {
  const contentDir = path.join(process.cwd(), "content")
  
  const entries = await fs.readdir(contentDir, { withFileTypes: true })
  
  const postFiles = entries
    .filter(entry => !entry.isDirectory() && entry.name.endsWith('.mdx') && entry.name !== '_index.mdx')
    .map(entry => entry.name)
  
  const folders = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
  
  const posts = await Promise.all(
    postFiles.map(async (fileName) => {
      const postSlug = fileName.replace(/\.mdx$/, "")
      const { frontmatter } = await import(`@/content/${fileName}`)
      
      return {
        slug: postSlug,
        frontmatter,
        isFolder: false
      }
    })
  )
  
  const folderItems = await Promise.all(
    folders.map(async (folderName) => {
      const { frontmatter } = await import(`@/content/${folderName}/_index.mdx`)
      
      return {
        slug: folderName,
        frontmatter,
        isFolder: true
      }
    })
  )
  
  const allItems: ContentListItemProps[] = [...posts, ...folderItems].sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })

  const { default: IndexContent } = await import('@/content/_index.mdx')
  
  return (
    <div>
      <div className="sm:mt-[8vw] mt-[40%] mb-2 xl:ml-[20%]">
        <h1 className="font-header tracking-tight text-6xl sm:text-8xl mb-2">Grady Arnold</h1>
        {/* <div className="text-base text-right mr-3.25 md:mr-[52%]">
          <Link href="/about" className="hover:underline">Contact</Link>
          <span className="mx-2">|</span>
          <Link href="/rss.xml" className="hover:underline">RSS</Link>
          <span className="mx-2">|</span>
          <Link href="/resume.pdf" className="hover:underline">Resume</Link>
        </div> */}
      </div>

      <div className="prose prose-lg py-20 lg:ml-[20%] lg:w-[55%]">
        <IndexContent />
      </div>
      
      <div className="space-y-6 lg:ml-[calc(25%-4rem)]">
        {allItems.map((item) => (
          <ContentListItem
            key={`${item.isFolder ? 'folder' : 'post'}-${item.slug}`}
            item={item}
          />
        ))}
      </div>
    </div>
  )
}
