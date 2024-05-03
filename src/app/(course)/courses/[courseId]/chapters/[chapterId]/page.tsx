import type { ReactNode } from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapter } from "~/lib/queries";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";

export default async function Page({
	params,
}: { params: { courseId: string; chapterId: string } }): Promise<ReactNode> {
	const { userId } = auth();

	if (!userId) {
		return redirect("/sign-in");
	}

	const chapter = await getChapter({
		userId,
		courseId: params.courseId,
		chapterId: params.chapterId,
	});

	if (!chapter) {
		return redirect(`/courses/${params.courseId}`);
	}

	const isLocked = !chapter.isFree && chapter.course.purchases.length < 1;
	const completedOnEnd =
		chapter.course.purchases.length > 0 &&
		!chapter.userProgresses[0]?.isCompleted;

	return (
		<section>
			<ScrollArea className={cn("h-[calc(100vh_-_4rem)]")}>
				<div className={cn("my-4 mx-8 space-y-6")}>
					{chapter.userProgresses[0]?.isCompleted && (
						<Alert>
							<CheckCircle className="h-4 w-4" />
							<AlertTitle>Completed!</AlertTitle>
							<AlertDescription>
								You have already completed this chapter.
							</AlertDescription>
						</Alert>
					)}
					{isLocked && (
						<Alert variant="destructive">
							<CheckCircle className="h-4 w-4" />
							<AlertTitle>Locked!</AlertTitle>
							<AlertDescription>
								You have already purchase this course to unlock this chapter.
							</AlertDescription>
						</Alert>
					)}
					{params.courseId} {params.chapterId}
				</div>
			</ScrollArea>
		</section>
	);
}
