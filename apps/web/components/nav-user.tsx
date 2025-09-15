'use client';

import { useAuthUser } from '@/hooks/use-auth-user';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { ChevronsUpDown, LogOut, User2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

type DropdownItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: string;
  onClick?: () => void;
};

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, isLoading } = useAuthUser();
  if (isLoading) return null;

  const dropdownItems: DropdownItem[][] = [
    [
      {
        label: 'Profile',
        href: `/profile`,
        icon: User2,
      },
    ],
    [
      {
        label: 'Log out',
        onClick: async () => {
          await signOut({ callbackUrl: '/' });
        },
        icon: LogOut,
      },
    ],
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image ?? ''} alt={user.username ?? ''} />
                <AvatarFallback className="rounded-lg">{user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name ?? user.username}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image ?? ''} alt={user.username ?? ''} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name ?? user.username}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {renderDropdownItems(dropdownItems)}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function renderDropdownItems(dropdownItems: DropdownItem[][]) {
  return dropdownItems.map((group, groupIdx) => (
    <div key={groupIdx}>
      <DropdownMenuGroup>
        {group.map((item, itemIdx) =>
          item.href ? (
            <DropdownMenuItem asChild key={itemIdx}>
              <Link href={item.href}>
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem key={itemIdx} onClick={item.onClick}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuGroup>
      {groupIdx < dropdownItems.length - 1 && <DropdownMenuSeparator />}
    </div>
  ));
}
