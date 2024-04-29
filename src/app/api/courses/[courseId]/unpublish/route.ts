import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {default as db} from "~/lib/db";


export async function PATCH(_request: NextRequest, {params}: {
  params: { courseId: string }
}): Promise<NextResponse> {
  try {
    const {userId} = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: true
      }
    })

    if (!ownCourse) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    // for (const ownChapter of ownCourse.chapters) {
    //   await db.chapter.update({
    //     where: {
    //       id: ownChapter.id,
    //       courseId: params.courseId,
    //     },
    //     data: {
    //       isPublished: false
    //     }
    //   })
    // }

    await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: false
      }
    })

    return NextResponse.json(ownCourse)
  } catch (error) {
    console.log("[COURSES_ID]", error)

    return new NextResponse("Internal Error", {status: 500})
  }
}
