import type { Category, Chapter, Course } from "~/lib/db";
import { default as db } from "~/lib/db";
import { getProgress } from "~/lib/queries";

export type CourseWithProgress = Course & {
  category: Category;
  chapters: Chapter[];
  progress?: number;
};

export type DashboardCourses = {
  completedCourses: CourseWithProgress[];
  coursesInProgress: CourseWithProgress[];
};

export async function getDashboardCourses({
  userId,
}: {
  userId: string;
}): Promise<DashboardCourses | undefined> {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map((purchase) => {
      return purchase.course;
    }) as CourseWithProgress[];

    for (const course of courses) {
      const progress = await getProgress(userId, course.id);
      course.progress = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100,
    );

    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100,
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("GET_DASHBOARD_COURSES", error);
  }
}
