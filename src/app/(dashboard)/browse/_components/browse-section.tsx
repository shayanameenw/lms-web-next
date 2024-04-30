import type { ReactNode } from "react";
import { Categories } from "~/app/(dashboard)/browse/_components/categories";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Category } from "~/lib/db";
import { cn } from "~/lib/utils";

interface BrowseSectionProps {
	className?: string;
	categories: Category[];
}

export function BrowseSection({
	className,
	categories,
}: Readonly<BrowseSectionProps>): ReactNode {
	return (
		<section>
			<ScrollArea className={cn("h-full", className)}>
				<Categories items={categories} />
			</ScrollArea>
		</section>
	);
}
