import type { ReactNode } from "react";
import { BrowseSection } from "~/app/(dashboard)/browse/_components/browse-section";
import { default as db } from "~/lib/db";
import { cn } from "~/lib/utils";

export default async function Page(): Promise<ReactNode> {
	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});

	return (
		<>
			<BrowseSection
				categories={categories}
				className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")}
			/>
		</>
	);
}
