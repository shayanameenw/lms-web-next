"use client"

import {ReactNode, useState} from "react";
import {usePathname} from "next/navigation";
import {default as Link} from "next/link";
import {UserButton} from "@clerk/nextjs";
import {BookType, X, LogOut, Menu, Search} from "lucide-react";
import {Sidebar} from "~/app/(dashboard)/_components/sidebar";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet";
import {ThemeMenu} from "~/components/theme/theme-menu";
import {cn} from "~/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({className}: Readonly<HeaderProps>): ReactNode {
  const [isSearching, setIsSearching] = useState(false)
  const pathname = usePathname()

  const isTeacherPage = pathname.startsWith("/teacher")
  const isPlayerPage = pathname.startsWith("chapter")

  return (
    <header className={cn("flex items-center justify-between gap-8", className)}>
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className={cn("p-0 md:hidden")} variant="ghost">
              <Menu size={24}/>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Sidebar className={cn("py-4 h-full flex flex-col gap-4")}/>
          </SheetContent>
        </Sheet>
        {
          pathname === "/browse" &&
          <Input className={cn("hidden md:block lg:w-96")} type="text" placeholder="Search..."/>
        }
      </div>
      <div className={cn("flex items-center gap-2")}>
        {!isSearching && (
          isTeacherPage || isPlayerPage ? (
            <Link href="/">
              <Button className={cn("rounded-full p-2 md:rounded-lg gap-2")} variant="outline">
                <LogOut size={16}/>
                <span className={cn("hidden md:block")}>
                Exit
              </span>
              </Button>
            </Link>
          ) : (
            <Link href="/teacher/courses">
              <Button className={cn("rounded-full p-2 md:rounded-lg")} variant="outline">
                <BookType className={cn("md:hidden")}/>
                <span className={cn("hidden md:block")}>
                Teacher Mode
              </span>
              </Button>
            </Link>
          )
        )
        }
        {pathname === "/browse" &&
          <div className={cn("border rounded-lg flex items-center gap-2", !isSearching && "border-none")}>
            {isSearching && (
              <Input className={cn("border-none")} type="text" placeholder="Search..."/>
            )}
            <Button onClick={() => {
              setIsSearching((prev) => !prev)
            }} className={cn("rounded-full p-2 md:hidden", isSearching && "border-none rounded-lg")} variant="outline">
              {isSearching
                ? <X/>
                : <Search/>
              }
            </Button>
          </div>}
        <ThemeMenu className={cn("rounded-full")} variant="outline"/>
        <Button className={cn("rounded-full py-2 px-1.5")} variant="outline">
          <UserButton/>
        </Button>
      </div>
    </header>
  )
}
