"use client"

import type {ReactNode} from "react";
import {default as Link} from "next/link";
import {usePathname} from "next/navigation";
import {Logo} from "~/components/common/logo";
import {ScrollArea} from "~/components/ui/scroll-area";
import {guestsRoutes, teacherRoutes} from "~/lib/routes";
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";

interface SidebarProps {
  className?: string;
}

export function Sidebar({className}: Readonly<SidebarProps>): ReactNode {
  const pathName = usePathname()

  const sidebarRoutes = pathName.startsWith("/teacher") ? teacherRoutes : guestsRoutes;

  return (
    <aside className={cn(className)}>
      <Logo/>
      <ScrollArea className={cn("flex-1")}>
        <ul className={cn("px-8 flex flex-col gap-2")}>
          {sidebarRoutes.map(({url, label}) => (
            <li key={label}>
              <Link href={url}>
                <Button className={cn("w-full justify-stretch")} variant={pathName === url ? "default" : "secondary"}>
                  {label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  )
}
