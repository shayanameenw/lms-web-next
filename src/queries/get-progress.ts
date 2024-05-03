import { default as db } from "~/lib/db";

export async function getProgress(
  userId: string,
  courseId: string,
): Promise<number | undefined> {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const completedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progress = (completedChapters / publishedChapterIds.length) * 100;

    return progress;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
  }
}
