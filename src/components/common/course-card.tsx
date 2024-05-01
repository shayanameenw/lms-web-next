import type { PropsWithChildren, ReactNode } from "react";
import type { Course } from "~/lib/db";

import { default as Link } from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface CourseCardProps {
	course: Course;
}

export function CourseCard({
	children,
	course,
}: Readonly<PropsWithChildren<CourseCardProps>>): ReactNode {
	return (
		<Link href={`/courses/${course.id}`}>
			<Card className={cn("h-56")}>
				<CardHeader>
					<CardTitle>{course.title}</CardTitle>
				</CardHeader>
				<CardContent>{children}</CardContent>
			</Card>
		</Link>
	);
}
