import { generatePageMetadata, pageMetadata } from '@/config/metadata';

export const metadata = generatePageMetadata(
  pageMetadata.dashboard.title,
  pageMetadata.dashboard.description,
  { noindex: true },
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
