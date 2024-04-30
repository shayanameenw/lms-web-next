import { auth } from "@clerk/nextjs/server";
import {
	DollarSign,
	File,
	FileWarning,
	LayoutDashboard,
	ListChecks,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AttachmentForm } from "~/app/(dashboard)/teacher/courses/[courseId]/_components/attachment-form";
import { CategoryForm } from "~/app/(dashboard)/teacher/courses/[courseId]/_components/category-form";
import { ChapterForm } from "~/app/(dashboard)/teacher/courses/[courseId]/_components/chapter-form";
import { CourseActions } from "~/app/(dashboard)/teacher/courses/[courseId]/_components/course-actions";
import { DescriptionForm } from "~/app/(dashboard)/teacher/courses/[courseId]/_components/description-form";
import { ImageForm } from "~/app/(dashboard)/teacher/courses/[courseId]/_components/image-form";
import { PriceForm } from "~/app/(dashboard)/teacher/courses/[courseId]/_components/price-form";
import { TitleForm } from "~/app/(dashboard)/teacher/courses/[courseId]/_components/title-form";
import { IconBadge } from "~/components/common/icon-badge";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { ScrollArea } from "~/components/ui/scroll-area";
import { default as db } from "~/lib/db";
import { cn } from "~/lib/utils";

export default async function Page({
	params,
}: { params: { courseId: string } }): Promise<ReactNode> {
	const { userId } = auth();

	if (!userId) {
		return redirect("/sign-in");
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
			userId,
		},
		include: {
			chapters: {
				orderBy: {
					position: "asc",
				},
			},
			attachments: {
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!course) {
		return notFound();
	}

	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});

	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished),
	];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;

	const completionText = `(${completedFields} / ${totalFields})`;

	const isComplete = requiredFields.every(Boolean);

	console.log(course.isPublished);

	return (
		<section>
			<ScrollArea className={cn("h-[calc(100vh_-_4rem)]")}>
				<div className={cn("my-4 mx-8 space-y-6")}>
					{!course.isPublished && (
						<Alert variant="destructive">
							<FileWarning className="h-4 w-4" />
							<AlertTitle>Course is not published!</AlertTitle>
							<AlertDescription>
								It will not be visible to the students.
							</AlertDescription>
						</Alert>
					)}
					<div className={cn("flex items-center justify-between gap-4")}>
						<div className={cn("space-y-2")}>
							<h2 className={cn("font-bold text-2xl")}>Course Setup</h2>
							<p className={cn("text-sm text-foreground/70")}>
								Complete all fields {completionText}
							</p>
						</div>
						<CourseActions
							isPublished={course.isPublished}
							courseId={params.courseId}
							disabled={!isComplete}
						/>
					</div>
					<div className={cn("grid lg:grid-cols-2 items-start gap-4")}>
						<div className={cn("space-y-4")}>
							<div className={cn("col-span-2 mb-8 flex gap-2 items-center")}>
								<IconBadge size="sm" Icon={LayoutDashboard} />
								<h3 className={cn("text-xl")}>Customize your course</h3>
							</div>
							<TitleForm initialData={course} courseId={course.id} />
							<DescriptionForm initialData={course} courseId={course.id} />
							<ImageForm initialData={course} courseId={course.id} />
							<CategoryForm
								options={categories.map((category) => ({
									label: category.name,
									value: category.id,
								}))}
								initialData={course}
								courseId={course.id}
							/>
						</div>
						<div className={cn("space-y-4")}>
							<div className={cn("col-span-2 mb-8 flex gap-2 items-center")}>
								<IconBadge size="sm" Icon={ListChecks} />
								<h3 className={cn("text-xl")}>Course chapters</h3>
							</div>
							<ChapterForm initialData={course} courseId={course.id} />
							<div className={cn("col-span-2 mb-8 flex gap-2 items-center")}>
								<IconBadge size="sm" Icon={DollarSign} />
								<h3 className={cn("text-xl")}>Sell your course</h3>
							</div>
							<PriceForm initialData={course} courseId={course.id} />
							<div className={cn("col-span-2 mb-8 flex gap-2 items-center")}>
								<IconBadge size="sm" Icon={File} />
								<h3 className={cn("text-xl")}>Resources & Attachments</h3>
							</div>
							<AttachmentForm initialData={course} courseId={course.id} />
						</div>
					</div>
				</div>
			</ScrollArea>
		</section>
	);
}
