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

    const { title } = await request.json();

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        courseId: params.courseId,
        title,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
