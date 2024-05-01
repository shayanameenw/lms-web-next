import type { ReactNode } from "react";
import { CourseCard } from "~/components/common/course-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

interface DashboardSectionProps {
	className?: string;
}

export function DashboardSection({
	className,
}: Readonly<DashboardSectionProps>): ReactNode {
	return (
		<section>
			<ScrollArea className={cn("h-full", className)}>
				<ul
					className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4")}
				>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
					<CourseCard>hehe</CourseCard>
				</ul>
			</ScrollArea>
		</section>
	);
}
