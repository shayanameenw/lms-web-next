"use client";

import { default as Link } from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "~/components/common/logo";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { guestsRoutes, teacherRoutes } from "~/lib/routes";
import { cn } from "~/lib/utils";

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className }: Readonly<SidebarProps>): ReactNode {
	const pathName = usePathname();

	const sidebarRoutes = pathName.startsWith("/teacher")
		? teacherRoutes
		: guestsRoutes;

	return (
		<aside className={cn(className)}>
			<Logo />
			<ScrollArea className={cn("flex-1")}>
				<ul className={cn("flex flex-col")}>
					{sidebarRoutes.map(({ url, label }) => {
						const isSelected =
							pathName === url ||
							(pathName !== "/" && pathName.startsWith(url));

						console.log("isSelected", isSelected ? "YES" : "NO");

						return (
							<li key={label}>
								<Link href={url}>
									<Button
										className={cn(
											"rounded-none w-full justify-stretch",
											isSelected && "md:border-r-2 border-primary",
										)}
										variant={isSelected ? "secondary" : "ghost"}
									>
										{label}
									</Button>
								</Link>
							</li>
						);
					})}
				</ul>
			</ScrollArea>
		</aside>
	);
}
