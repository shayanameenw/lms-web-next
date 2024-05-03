"use client";

import type { ReactNode } from "react";

import { UserButton } from "@clerk/nextjs";
import { BookType, LogOut, Menu, Search, X } from "lucide-react";
import { default as Link } from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { default as qs } from "query-string";
import { useEffect, useState } from "react";
import { Sidebar } from "~/app/(dashboard)/_components/sidebar";
import { ThemeMenu } from "~/components/theme/theme-menu";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { useDebounce } from "~/hooks/use-debounce";
import { cn } from "~/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: Readonly<HeaderProps>): ReactNode {
  const [isSearching, setIsSearching] = useState(false);
  const [title, setTitle] = useState("");

  const debouncedTitle = useDebounce(title);

  const pathname = usePathname();

  const isTeacherPage = pathname.startsWith("/teacher");
  const isBrowsePage = pathname.startsWith("/courses");

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedTitle,
          categoryId: currentCategoryId,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  }, [pathname, router, debouncedTitle, currentCategoryId]);

  return (
    <header
      className={cn("flex items-center justify-between gap-8", className)}
    >
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className={cn("p-0 md:hidden")}
              variant="ghost"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Sidebar className={cn("py-4 h-full flex flex-col gap-4")} />
          </SheetContent>
        </Sheet>
        {isBrowsePage && (
          <Input
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            value={title}
            className={cn("hidden md:block md:w-96")}
            type="text"
            placeholder="Search..."
          />
        )}
      </div>
      <div className={cn("flex items-center gap-2")}>
        {!isSearching &&
          (isTeacherPage ? (
            <Link href="/">
              <Button
                className={cn("rounded-full p-2 md:rounded-lg gap-2")}
                variant="outline"
              >
                <LogOut size={16} />
                <span className={cn("hidden md:block")}>Exit</span>
              </Button>
            </Link>
          ) : (
            <Link href="/teacher">
              <Button
                className={cn("rounded-full p-2 md:rounded-lg")}
                variant="outline"
              >
                <BookType className={cn("md:hidden")} />
                <span className={cn("hidden md:block")}>Teacher Mode</span>
              </Button>
            </Link>
          ))}
        {isBrowsePage && (
          <div
            className={cn(
              "border rounded-lg flex items-center gap-2",
              !isSearching && "border-none",
            )}
          >
            {isSearching && (
              <Input
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
                value={title}
                className={cn("border-none")}
                type="text"
                placeholder="Search..."
              />
            )}
            <Button
              onClick={() => {
                setIsSearching((prev) => !prev);
              }}
              className={cn(
                "rounded-full p-2 md:hidden",
                isSearching && "border-none rounded-lg",
              )}
              variant="outline"
            >
              {isSearching ? <X /> : <Search />}
            </Button>
          </div>
        )}
        <ThemeMenu
          className={cn("rounded-full")}
          variant="outline"
        />
        <Button
          className={cn("rounded-full py-2 px-1.5")}
          variant="outline"
        >
          <UserButton />
        </Button>
      </div>
    </header>
  );
}
