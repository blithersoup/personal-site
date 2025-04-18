import rss from 'rss';
import { Metadata } from 'next';
import fs from "fs/promises"
import path from "path"

export async function GET() {
  const feed = new rss({
    title: 'Your Site Title',
    description: 'Your Site Description',
    feed_url: 'https://your-site.com/rss.xml',
    site_url: 'https://your-site.com',
    managingEditor: 'Your Name',
    webMaster: 'Your Name',
    copyright: `${new Date().getFullYear()} Your Name`,
    language: 'en',
    pubDate: new Date(),
    ttl: 60,
  });

  const contentDir = path.join(process.cwd(), "content");
  const entries = await fs.readdir(contentDir, { withFileTypes: true });

  const postFiles = entries
    .filter(entry => !entry.isDirectory() && entry.name.endsWith('.mdx') && entry.name !== '_index.mdx')
    .map(entry => entry.name);

  const folders = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const posts = await Promise.all(
    postFiles.map(async (fileName) => {
      const postSlug = fileName.replace(/\.mdx$/, "");
      const importPath = "@/content/" + fileName;
      const { frontmatter } = await import(importPath as any);

      return {
        slug: postSlug,
        frontmatter,
        isFolder: false
      };
    })
  );

  const folderItems = await Promise.all(
    folders.map(async (folderName) => {
      const importPath = "@/content/" + folderName + "/_index.mdx";
      const { frontmatter } = await import(importPath as any);

      return {
        slug: folderName,
        frontmatter,
        isFolder: true
      };
    })
  );

  const allItems = [...posts, ...folderItems].sort((a, b) => {
    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
  });

  allItems.forEach((item) => {
    feed.item({
      title: item.frontmatter.title,
      description: item.frontmatter.description,
      url: "https://your-site.com/blog/" + item.slug,
      date: item.frontmatter.date,
    });
  });

  const xml = feed.xml();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}