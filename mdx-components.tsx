import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

interface ImgProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
}

export const Img: React.FC<ImgProps> = ({ 
  src, 
  alt, 
  caption,
  priority = false
}) => {
  return (
    <div className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] mb-6">
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

interface RowProps {
  children: React.ReactNode;
  desc?: string;
}

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
    
    // img: ({ 
    //   src, alt, caption, priority
    // }: { 
    //   src: string, alt: string, caption?: string, priority?: boolean 
    // }) => (
    //   <div className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] mb-6">
    //   <div className="aspect-square relative overflow-hidden rounded-lg shadow-lg border border-gray-200">
    //     <Image
    //       src={src}
    //       caption={alt}
    //       fill
    //       priority={priority}
    //       sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
    //       className="object-cover"
    //     />
    //   </div>
    // </div>
    // ),

    // // Responsive images
    // img: (props) => (
    //   <div className="my-10">
    //     <Image
    //       className="rounded-md mx-auto"
    //       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 760px"
    //       style={{ width: '100%', height: 'auto' }}
    //       {...(props as ImageProps)}
    //       caption={props.alt || ""}
    //     />
    //     {props.alt && (
    //       <figcaption className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-400">
    //         {props.alt}
    //       </figcaption>
    //     )}
    //   </div>
    // ),
    
    ...components,
  }
}