import Link from "next/link";
import { CubeIcon } from "@radix-ui/react-icons";

interface Frontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

export interface ContentListItemProps {
  slug: string;
  frontmatter: Frontmatter;
  isFolder?: boolean;
  basePath?: string;
}

export function ContentListItem({ item }: { item: ContentListItemProps }) {
  const isFolder = item.isFolder ?? false;
  const defaultBasePath = isFolder ? '/blog/folder' : '/blog/post';
  const basePath = item.basePath ?? defaultBasePath;
  const linkHref = `${basePath}/${item.slug}`;

  return (
    <div className="mb-8">
      <Link href={linkHref} className="no-underline group">
        <div className="flex items-center">
          {isFolder && (
            <CubeIcon className="w-5 h-5 mr-2 text-[var(--accent-1)]" />
          )}
          <h2 className="text-xl font-medium mb-1 group-hover:underline">
            {item.frontmatter.title}
          </h2>
        </div>
      </Link>

      <p className="text-sm mb-2">
        {new Date(item.frontmatter.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC'
        })}
      </p>
      <p className="line-clamp-2">
        {item.frontmatter.description}
      </p>
    </div>
  );
}