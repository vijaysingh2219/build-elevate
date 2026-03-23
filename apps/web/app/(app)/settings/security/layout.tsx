import { generatePageMetadata, pageMetadata } from '@/config/metadata';

export const metadata = generatePageMetadata(
  pageMetadata.settings.security.title,
  pageMetadata.settings.security.description,
  { noindex: true },
);

export default function SecuritySettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
