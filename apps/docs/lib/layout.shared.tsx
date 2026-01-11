import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Layers } from "lucide-react";

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
  };
}
