import { generatePageMetadata, pageMetadata } from '@/config/metadata';

export const metadata = generatePageMetadata(
  pageMetadata.settings.general.title,
  pageMetadata.settings.general.description,
  { noindex: true },
);

export default function GeneralSettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
