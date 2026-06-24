import type { IconType } from "react-icons";
import {
  SiDocker,
  SiExpress,
  SiNextdotjs,
  SiPrisma,
  SiTailwindcss,
  SiTurborepo,
} from "react-icons/si";

type Tech = { name: string; icon?: IconType };

const STACK: Tech[] = [
  { name: "Turborepo", icon: SiTurborepo },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Express", icon: SiExpress },
  { name: "Better Auth" },
  { name: "Prisma", icon: SiPrisma },
  { name: "shadcn/ui" },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Docker", icon: SiDocker },
];

export function TechLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
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
