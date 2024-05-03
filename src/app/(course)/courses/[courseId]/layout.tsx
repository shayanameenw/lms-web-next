import type { PropsWithChildren, ReactNode } from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseHeader } from "~/app/(course)/courses/[courseId]/_components/course-header";
import { default as db } from "~/lib/db";
import { cn } from "~/lib/utils";
import { getProgress } from "~/queries/get-progress";
import { CourseSidebar } from "./_components/course-sidebar";

export default async function Page({
  children,
  params,
}: Readonly<
  PropsWithChildren<{ params: { courseId: string } }>
>): Promise<ReactNode> {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgresses: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/browse");
  }

  const progress = await getProgress(userId, course.id);

  return (
    <main
      className={cn(
        "h-full md:grid grid-cols-[16rem_,_1fr] grid-rows-[4rem_,_1fr]",
      )}
    >
      <CourseSidebar
        course={course}
        progress={progress}
        className={cn(
          "border-r py-4 h-full row-span-full hidden md:flex flex-col gap-4",
        )}
      />
      <CourseHeader
        course={course}
        progress={progress}
        className={cn("border-b px-8 py-4 flex items-center justify-between")}
      />
      {children}
    </main>
  );
}
