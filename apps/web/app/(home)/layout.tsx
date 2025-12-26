import { generatePageMetadata, pageMetadata } from '@/config/metadata';

export const metadata = generatePageMetadata(
  pageMetadata.home.title,
  pageMetadata.home.description,
);

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
