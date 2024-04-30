import type { PropsWithChildren, ReactNode } from "react";
import { Header } from "~/app/(dashboard)/_components/header";
import { Sidebar } from "~/app/(dashboard)/_components/sidebar";
import { cn } from "~/lib/utils";

export default function Layout({
	children,
}: Readonly<PropsWithChildren>): ReactNode {
	return (
		<main
			className={cn(
				"h-full md:grid grid-cols-[16rem_,_1fr] grid-rows-[4rem_,_1fr]",
			)}
		>
			<Sidebar
				className={cn(
					"border-r py-4 h-full row-span-full hidden md:flex flex-col gap-4",
				)}
			/>
			<Header
				className={cn("border-b px-8 py-4 flex items-center justify-between")}
			/>
			{children}
		</main>
	);
}
