import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {default as db} from "~/lib/db";

export async function PUT(request: NextRequest, {params}: { params: { courseId: string } }): Promise<NextResponse> {
  try {
    const {userId} = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      }
    })

    if (!course) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const {list} = await request.json()

    for (const item of list) {
      await db.chapter.update(
        {
          where: {
            id: item.id,
          },
          data: {
            position: item.position
          }
        }
      )
    }

    const chapters = (await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc"
          }
        }
      }
    }))?.chapters

    return NextResponse.json(chapters)
  } catch (error) {
    console.log("[COURSES_ID_CHAPTERS_REORDER]", error)

    return new NextResponse("Internal Error", {status: 500})
  }
}
