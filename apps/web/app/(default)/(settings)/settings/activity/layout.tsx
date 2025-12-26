import { generatePageMetadata, pageMetadata } from '@/config/metadata';

export const metadata = generatePageMetadata(
  pageMetadata.settings.activity.title,
  pageMetadata.settings.activity.description,
  { noindex: true },
);

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
