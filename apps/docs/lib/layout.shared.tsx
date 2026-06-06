import { NPM } from "@/components/icons/npm";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookIcon, HistoryIcon, Layers } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <span className="font-semibold">Build Elevate</span>
        </div>
      ),
    },
    links: [
      {
        icon: <BookIcon />,
        text: "Documentation",
        url: "/docs",
        secondary: false,
      },
      {
        icon: <HistoryIcon />,
        text: "Changelog",
        url: "/changelog",
        secondary: false,
      },
      {
        type: "icon",
        icon: <NPM />,
        text: "NPM",
        url: "https://www.npmjs.com/package/build-elevate",
        external: true,
      },
    ],
    githubUrl: "https://github.com/vijaysingh2219/build-elevate",
  };
}
