import { HomeLayout, HomeLayoutProps } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { BookIcon, HistoryIcon } from "lucide-react";

function homeOptions(): HomeLayoutProps {
  return {
    ...baseOptions(),
    githubUrl: "https://github.com/vijaysingh2219/build-elevate",
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
    ],
  };
}

export default function Layout({ children }: LayoutProps<"/">) {
  return <HomeLayout {...homeOptions()}>{children}</HomeLayout>;
}
