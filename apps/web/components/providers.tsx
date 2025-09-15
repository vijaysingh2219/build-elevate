'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@workspace/ui/components/sidebar';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <SidebarProvider>
        <TooltipProvider>
          <AppSidebar />
          <Toaster richColors />
          {children}
        </TooltipProvider>
      </SidebarProvider>
    </NextThemesProvider>
  );
}
