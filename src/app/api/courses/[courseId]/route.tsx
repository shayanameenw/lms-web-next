import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {default as db} from "~/lib/db";

export async function PATCH(request: NextRequest, {params}: { params: { courseId: string } }): Promise<NextResponse> {
  try {
    const {userId} = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const data = await request.json()

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log("[COURSES_ID]", error)

    return new NextResponse("Internal Error", {status: 500})
  }
}