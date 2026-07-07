"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@kkb/ui/components/navigation-menu";

type NavigationItem = {
  href: string;
  title: string;
  detail: string;
};

const navigationItems: ReadonlyArray<NavigationItem> = [
  {
    href: "#layout",
    title: "Layout systems",
    detail: "Structural primitives for cards, rails, and workspace framing.",
  },
  {
    href: "#navigation",
    title: "Anchored browsing",
    detail: "Sections stay easy to scan without forcing the route shell client-side.",
  },
  {
    href: "#input",
    title: "Focused controls",
    detail: "Selection and entry patterns keep state inside small client islands.",
  },
];

export function NavigationMenuDemo() {
  return (
    <div className="flex justify-center p-6">
      <NavigationMenu viewport={false} className="w-full max-w-xl justify-start">
        <NavigationMenuList className="w-full justify-start rounded-md bg-muted/20 p-2">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Catalog</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[min(26rem,calc(100vw-5rem))]">
              <div className="grid gap-2 p-1">
                {navigationItems.map((item) => (
                  <NavigationMenuLink
                    key={item.href}
                    href={item.href}
                    className="rounded-md border"
                  >
                    <span className="font-medium text-foreground">{item.title}</span>
                    <span className="text-muted-foreground">{item.detail}</span>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink href="#feedback" className="px-4 py-2 font-medium">
              Feedback
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink href="#audio" className="px-4 py-2 font-medium">
              Audio
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuIndicator />
      </NavigationMenu>
    </div>
  );
}
