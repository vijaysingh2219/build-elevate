import type { ComponentType, SVGProps } from "react";
import {
  SiDocker,
  SiExpress,
  SiNextdotjs,
  SiPrisma,
  SiTailwindcss,
  SiTurborepo,
} from "react-icons/si";
import { BetterAuth } from "@/components/icons/better-auth";
import { ShadCN } from "@/components/icons/shadcn-ui";

type Tech = {
  name: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

const STACK: Tech[] = [
  { name: "Turborepo", icon: SiTurborepo },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Express", icon: SiExpress },
  { name: "Better Auth", icon: BetterAuth },
  { name: "Prisma", icon: SiPrisma },
  { name: "shadcn/ui", icon: ShadCN },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Docker", icon: SiDocker },
];

export function TechLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-11">
      {STACK.map(({ name, icon: Icon }) => (
        <div
          key={name}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          {Icon && <Icon className="size-5" />}
          <span className="text-sm font-medium tracking-tight">{name}</span>
        </div>
      ))}
    </div>
  );
}
