import type { PropsWithChildren, ReactNode } from "react";
import type { Course } from "~/lib/db";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface CourseCardProps {
	item: Course;
}

export function CourseCard({
	children,
	item,
}: Readonly<PropsWithChildren<CourseCardProps>>): ReactNode {
	return (
		<Card className={cn("h-56")}>
			<CardHeader>
				<CardTitle>{item.title}</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}
