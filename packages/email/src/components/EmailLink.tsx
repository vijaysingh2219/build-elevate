import { Link } from '@react-email/components';
import { ReactNode } from 'react';

interface EmailLinkProps {
  href: string;
  children: ReactNode;
}

export const EmailLink = ({ href, children }: EmailLinkProps) => {
  return (
    <Link href={href} className="break-all text-[13px] text-[#0f172a] underline">
      {children}
    </Link>
  );
};
