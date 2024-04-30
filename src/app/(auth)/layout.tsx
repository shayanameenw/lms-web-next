import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "~/lib/utils";

export default function Layout({
	children,
}: Readonly<PropsWithChildren>): ReactNode {
	return (
		<main className={cn("h-full grid place-content-center")}>{children}</main>
	);
}
