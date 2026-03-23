'use client';

import Logo from '@/components/ui/logo';
import { SidebarTrigger, useSidebar } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';
import Link from 'next/link';

function Header() {
  const { isMobile } = useSidebar();
  return (
    <header
      className={cn(
        'bg-background relative h-12 w-screen items-center px-4 py-2',
        isMobile ? 'flex' : 'hidden',
      )}
    >
      <SidebarTrigger />
      <Link href="/" className="absolute left-1/2 -translate-x-1/2">
        <Logo variant="header" />
      </Link>
    </header>
  );
}

export default Header;
