"use client";

import type { Chapter, Purchase, UserProgress } from "@prisma/client";

import { CheckCircleIcon, LockIcon, PlayCircleIcon } from "lucide-react";
import { default as Link } from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface CourseSidebarItemProps {
	courseId: string;
	chapter: Chapter & {
		userProgresses: UserProgress[];
	};
	purchase: Purchase | null;
}

export function CourseSidebarItem({
	courseId,
	chapter,
	purchase,
}: Readonly<CourseSidebarItemProps>) {
	const pathname = usePathname();

	const isActive = pathname.includes(chapter.id);
	const isLocked = !chapter.isFree && !purchase;
	const isCompleted = chapter.userProgresses[0]?.isCompleted;
	const ChapterIcon = isLocked
		? LockIcon
		: isCompleted
			? CheckCircleIcon
			: PlayCircleIcon;

	return (
		<li key={chapter.id}>
			<Link href={`/courses/${courseId}/chapters/${chapter.id}`}>
				<Button
					className={cn(
						"rounded-none w-full justify-stretch gap-4",
						isActive && "md:border-r-2 border-primary",
					)}
					variant={isActive ? "secondary" : "ghost"}
				>
					<ChapterIcon size={16} />
					<span>{chapter.title}</span>
				</Button>
			</Link>
		</li>
	);
}
