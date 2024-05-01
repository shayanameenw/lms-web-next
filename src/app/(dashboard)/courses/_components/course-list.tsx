import type { ReactNode } from "react";
import { CourseCard } from "~/components/common/course-card";
import { cn } from "~/lib/utils";
import type { CourseWithProgress } from "~/queries/get-courses";

interface CourseListProps {
	items?: CourseWithProgress[];
}

export function CourseList({ items }: Readonly<CourseListProps>): ReactNode {
	return (
		<>
			<ul
				className={cn(
					"my-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
				)}
			>
				{items?.map((item) => {
					return (
						<li key={item.id}>
							<CourseCard course={item} />
						</li>
					);
				})}
			</ul>
			{items?.length === 0 && (
				<div className="text-center">
					<p>No Courses Found!</p>
				</div>
			)}
		</>
	);
}
