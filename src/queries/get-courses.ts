import type { Category, Course } from "~/lib/db";
import { default as db } from "~/lib/db";
import { getProgress } from "~/lib/queries";

export type CourseWithProgress = Course & {
  chapters: { id: string }[];
  category?: Category | null;
  progress?: number | null;
};

export async function getCourses({
  userId,
  title,
  categoryId,
}: {
  userId: string;
  title?: string;
  categoryId?: string;
}): Promise<CourseWithProgress[] | undefined> {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        categoryId,
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        category: true,
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgress[] = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progress = await getProgress(userId, course.id);

        return {
          ...course,
          progress,
        };
      }),
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("GET_COURSES", error);
  }
}
