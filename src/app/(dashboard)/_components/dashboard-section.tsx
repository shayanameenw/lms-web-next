import type { PropsWithChildren, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

interface DashboardSectionProps {
	className?: string;
}

export function CourseCard({
	children,
}: Readonly<PropsWithChildren>): ReactNode {
	return (
		<Card className={cn("h-56")}>
			<CardHeader>
				<CardTitle>Lorem ipsum.</CardTitle>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
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
