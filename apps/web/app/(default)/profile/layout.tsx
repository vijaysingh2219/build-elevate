import { generatePageMetadata, pageMetadata } from '@/config/metadata';

export const metadata = generatePageMetadata(
  pageMetadata.profile.title,
  pageMetadata.profile.description,
  { noindex: true },
);

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
