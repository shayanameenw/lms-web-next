import { auth } from "@clerk/nextjs/server";
import { Eye, FileWarning, LayoutDashboard, Video } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ChapterAccessForm } from "~/app/(dashboard)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-access-form";
import { ChapterActions } from "~/app/(dashboard)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-actions";
import { ChapterDescriptionForm } from "~/app/(dashboard)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form";
import { ChapterTitleForm } from "~/app/(dashboard)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-title-form";
import { ChapterVideoForm } from "~/app/(dashboard)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-video-form";
import { IconBadge } from "~/components/common/icon-badge";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { ScrollArea } from "~/components/ui/scroll-area";
import { default as db } from "~/lib/db";
import { cn } from "~/lib/utils";

export default async function Page({
	params,
}: { params: { courseId: string; chapterId: string } }): Promise<ReactNode> {
	const { userId } = auth();

	if (!userId) {
		return redirect("/sign-in");
	}

	const chapter = await db.chapter.findUnique({
		where: {
			id: params.chapterId,
			courseId: params.courseId,
		},
		include: {
			muxData: true,
		},
	});

	if (!chapter) {
		return notFound();
	}

	const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;

	const requiredText = `(${completedFields} / ${totalFields})`;

	const isComplete = requiredFields.every(Boolean);

	return (
		<section>
			<ScrollArea className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")}>
				<div className={cn("space-y-6")}>
					{!chapter.isPublished && (
						<Alert variant="destructive">
							<FileWarning className="h-4 w-4" />
							<AlertTitle>Chapter is not published!</AlertTitle>
							<AlertDescription>
								It will not be visible in the course.
							</AlertDescription>
						</Alert>
					)}
					<div className={cn("flex items-center justify-between gap-4")}>
						<div className={cn("space-y-2")}>
							<h2 className={cn("font-bold text-2xl")}>Chapter Setup</h2>
							<p className={cn("text-sm text-foreground/70")}>
								Complete all fields {requiredText}
							</p>
						</div>
						<ChapterActions
							isPublished={chapter.isPublished}
							courseId={params.courseId}
							chapterId={params.chapterId}
							disabled={!isComplete}
						/>
					</div>
					<div className={cn("grid lg:grid-cols-2 items-start gap-4")}>
						<div className={cn("space-y-4")}>
							<div className={cn("col-span-2 mb-8 flex gap-2 items-center")}>
								<IconBadge size="sm" Icon={LayoutDashboard} />
								<h3 className={cn("text-xl")}>Customize your chapter</h3>
							</div>
							<ChapterTitleForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={chapter.id}
							/>
							<ChapterDescriptionForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={chapter.id}
							/>
						</div>
						<div className={cn("space-y-4")}>
							<div className={cn("col-span-2 mb-8 flex gap-2 items-center")}>
								<IconBadge size="sm" Icon={Eye} />
								<h3 className={cn("text-xl")}>Access Settings</h3>
							</div>
							<ChapterAccessForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={chapter.id}
							/>
							<div className={cn("col-span-2 mb-8 flex gap-2 items-center")}>
								<IconBadge size="sm" Icon={Video} />
								<h3 className={cn("text-xl")}>Add a Video</h3>
							</div>
							<ChapterVideoForm
								initialData={chapter}
								courseId={params.courseId}
								chapterId={chapter.id}
							/>
						</div>
					</div>
				</div>
			</ScrollArea>
		</section>
	);
}
