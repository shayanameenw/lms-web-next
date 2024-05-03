import type { ReactNode } from "react";
import type { Chapter, Course, UserProgress } from "~/lib/db";

import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { ThemeMenu } from "~/components/theme/theme-menu";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { cn } from "~/lib/utils";
import { CourseSidebar } from "./course-sidebar";

interface HeaderProps {
	className?: string;
	course: Course & {
		chapters: (Chapter & {
			userProgresses: UserProgress[];
		})[];
	};
	progress?: number;
}

export function CourseHeader({
	className,
	course,
	progress,
}: Readonly<HeaderProps>): ReactNode {
	return (
		<header
			className={cn("flex items-center justify-between gap-8", className)}
		>
			<div>
				<Sheet>
					<SheetTrigger asChild>
						<Button className={cn("p-0 md:hidden")} variant="ghost">
							<Menu size={24} />
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<CourseSidebar
							course={course}
							progress={progress}
							className={cn("py-4 h-full flex flex-col gap-4")}
						/>
					</SheetContent>
				</Sheet>
			</div>
			<div className={cn("flex items-center gap-2")}>
				<ThemeMenu className={cn("rounded-full")} variant="outline" />
				<Button className={cn("rounded-full py-2 px-1.5")} variant="outline">
					<UserButton />
				</Button>
			</div>
		</header>
	);
}
