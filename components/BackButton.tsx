import Link from "next/link";
import { ArrowLeftIcon } from '@radix-ui/react-icons';

interface BackButtonProps {
  href: string;
  text: string;
}

export function BackButton({ href, text }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="flex items-center mb-6 text-sm group no-underline"
    >
      <ArrowLeftIcon className="w-4 h-4 mr-1 text-[var(--accent-1)]" />
      <span className="group-hover:underline text-md">{text}</span>
    </Link>
  );
}