import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { default as db } from "~/lib/db";

export async function PATCH(
	_request: NextRequest,
	{
		params,
	}: {
		params: { courseId: string };
	},
): Promise<NextResponse> {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const ownCourse = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId,
			},
			include: {
				chapters: true,
			},
		});

		if (!ownCourse) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const atLeastOneChapterPublished = ownCourse.chapters.some(
			(chapter) => chapter.isPublished,
		);

		if (
			!ownCourse.title ||
			!ownCourse.description ||
			!ownCourse.imageUrl ||
			!ownCourse.categoryId ||
			!ownCourse.price ||
			ownCourse.chapters.length < 1 ||
			!atLeastOneChapterPublished
		) {
			return new NextResponse("Missing Required Fields!", { status: 400 });
		}

		await db.course.update({
			where: {
				id: params.courseId,
			},
			data: {
				isPublished: true,
			},
		});

		return NextResponse.json(ownCourse);
	} catch (error) {
		console.log("[COURSES_ID]", error);

		return new NextResponse("Internal Error", { status: 500 });
	}
}
