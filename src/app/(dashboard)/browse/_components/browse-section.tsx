import type { ReactNode } from "react";
import { Categories } from "~/app/(dashboard)/browse/_components/categories";
import { CourseList } from "~/app/(dashboard)/browse/_components/course-list";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Category } from "~/lib/db";
import { cn } from "~/lib/utils";
import type { CourseWithProgress } from "~/queries/get-courses";

interface BrowseSectionProps {
	className?: string;
	categories: Category[];
	courses?: CourseWithProgress[];
}

export function BrowseSection({
	className,
	categories,
	courses,
}: Readonly<BrowseSectionProps>): ReactNode {
	return (
		<section>
			<ScrollArea className={cn("h-full", className)}>
				<Categories items={categories} />
				<CourseList items={courses} />
			</ScrollArea>
		</section>
	);
}
