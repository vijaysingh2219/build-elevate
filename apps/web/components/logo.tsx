'use client';

import { config } from '@/config/site';
import { useSidebar } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';
import { Layers } from 'lucide-react';

type LogoProps = {
  variant: 'default' | 'header' | 'sidebar' | 'auth-form' | 'notFound';
  classes?: {
    container?: string;
    logo?: string;
    icon?: string;
    text?: string;
  };
};

export default function Logo({ variant, classes }: LogoProps) {
  const { state } = useSidebar();
  const defaults = getDefaults(variant);
  const showText =
    variant === 'sidebar' ? state === 'expanded' : ['header', 'auth-form'].includes(variant);

  return (
    <div className={cn(defaults.container, classes?.container ?? '')}>
      <div className={cn(defaults.logo, classes?.logo ?? '')}>
        <Layers className={cn(defaults.icon, classes?.icon ?? '')} />
      </div>
      {showText && <span className={cn(defaults.text, classes?.text ?? '')}>{config.name}</span>}
    </div>
  );
}

function getDefaults(variant: LogoProps['variant']) {
  const containerBaseClass = 'flex items-center space-x-2';
  const logoBaseClass =
    'from-primary via-primary/50 to-secondary drop-shadow-primary rounded-xl p-1 bg-gradient-to-br drop-shadow text-white flex items-center justify-center flex-shrink-0';
  const iconBaseClass = 'size-8';
  const textBaseClass = 'text-2xl sm:text-3xl font-semibold tracking-tight';

  switch (variant) {
    case 'sidebar':
      return {
        container: cn(containerBaseClass),
        logo: cn(logoBaseClass, 'size-6'),
        icon: cn(iconBaseClass, 'size-4 sm:size-5'),
        text: cn(textBaseClass, '!text-xl'),
      };
    case 'notFound':
      return {
        container: cn(containerBaseClass),
        logo: cn(logoBaseClass, 'size-16'),
        icon: cn(iconBaseClass),
        text: cn(textBaseClass),
      };
    case 'header':
      return {
        container: cn(containerBaseClass),
        logo: cn(logoBaseClass, 'size-7 xs:size-8'),
        icon: cn(iconBaseClass, 'size-5 xs:size-6 sm:size-8'),
        text: cn(textBaseClass, 'text-lg sm:text-2xl'),
      };
    case 'auth-form':
      return {
        container: cn(containerBaseClass),
        logo: cn(logoBaseClass, 'size-8 sm:size-10'),
        icon: cn(iconBaseClass, 'size-6 sm:size-8'),
        text: cn(textBaseClass),
      };
    default:
      return {
        container: cn(containerBaseClass),
        logo: cn(logoBaseClass),
        icon: cn(iconBaseClass),
        text: cn(textBaseClass),
      };
  }
}
