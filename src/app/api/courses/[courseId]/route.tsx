import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {default as db} from "~/lib/db";
import {default as Mux} from "@mux/mux-node";

const {video} = new Mux(
  {
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  }
)

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

export async function DELETE(request: NextRequest, {params}: {
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
      }
    })

    if (!ownCourse) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const chapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
      }
    })

    for (const chapter of chapters) {
      if (chapter?.videoUrl) {
        const existingMuxData = await db.muxData.findFirst({
          where: {
            chapterId: chapter.id,
          }
        })

        if (existingMuxData) {
          await video.assets.delete(existingMuxData.assetId)

          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
            }
          })
        }
      }

      await db.chapter.delete({
        where: {
          id: chapter.id,
          courseId: params.courseId
        }
      })
    }

    await db.course.delete({
      where: {
        id: ownCourse.id,
      }
    })
    
    return NextResponse.json(ownCourse)
  } catch (error) {
    console.log("[COURSES_ID_CHAPTER_ID]", error)

    return new NextResponse("Internal Error", {status: 500})
  }
}
