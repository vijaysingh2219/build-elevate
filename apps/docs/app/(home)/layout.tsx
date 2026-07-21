import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { CSSProperties } from "react";
import { baseOptions } from "@/lib/layout.shared";

// Fumadocs defaults --fd-layout-width to 1400px.
const layoutStyle = { "--fd-layout-width": "64rem" } as CSSProperties;

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout {...baseOptions()} style={layoutStyle}>
      {children}
    </HomeLayout>
  );
}
