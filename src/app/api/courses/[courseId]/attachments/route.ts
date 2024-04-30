import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { default as db } from "~/lib/db";

export async function POST(
	request: NextRequest,
	{ params }: { params: { courseId: string } },
): Promise<NextResponse> {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const course = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId,
			},
		});

		if (!course) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { url } = await request.json();

		const attachment = await db.attachment.create({
			data: {
				courseId: params.courseId,
				name: url.split("/").pop(),
				url,
			},
		});

		return NextResponse.json(attachment);
	} catch (error) {
		console.log("[COURSES]", error);

		return new NextResponse("Internal Error", { status: 500 });
	}
}
