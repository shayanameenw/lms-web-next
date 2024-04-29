import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {default as Mux} from "@mux/mux-node"
import {default as db} from "~/lib/db";

const {video} = new Mux(
  {
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  }
)

export async function PATCH(request: NextRequest, {params}: {
  params: { courseId: string; chapterId: string }
}): Promise<NextResponse> {
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

    const {isPublished, ...data} = await request.json()

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data
    })

    if (data.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
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

      const asset = await video.assets.create({
        input: data.videoUrl,
        playback_policy: ["public"],
        test: false
      })

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id
        }
      })
    }

    const publishedChapters = await db.chapter.findMany(
      {
        where: {
          courseId: params.courseId,
          isPublished: true
        }
      },
    )

    if (publishedChapters.length < 1) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false
        }
      })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.log("[COURSES_ID_CHAPTER_ID]", error)

    return new NextResponse("Internal Error", {status: 500})
  }
}

export async function DELETE(request: NextRequest, {params}: {
  params: { courseId: string; chapterId: string }
}): Promise<NextResponse> {
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

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      }
    })

    if (chapter?.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
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
        id: params.chapterId,
        courseId: params.courseId
      }
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.log("[COURSES_ID_CHAPTER_ID]", error)

    return new NextResponse("Internal Error", {status: 500})
  }
}
