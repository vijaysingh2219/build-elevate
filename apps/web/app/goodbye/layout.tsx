import { generatePageMetadata, pageMetadata } from '@/config/metadata';

export const metadata = generatePageMetadata(
  pageMetadata.goodbye.title,
  pageMetadata.goodbye.description,
);

export default function GoodbyeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
