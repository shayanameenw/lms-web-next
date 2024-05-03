import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import db from "~/lib/db";

export default async function Page({
	params,
}: { params: { courseId: string } }): Promise<ReactNode> {
	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
		select: {
			chapters: {
				where: {
					isPublished: true,
				},
				select: {
					id: true,
				},
				orderBy: {
					position: "asc",
				},
			},
		},
	});

	return redirect(
		`/courses/${params.courseId}/chapters/${course?.chapters[0].id}`,
	);
}
