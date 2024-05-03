import type { Chapter, Course, UserProgress } from "@prisma/client";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";
import { default as db } from "~/lib/db";
import { cn } from "~/lib/utils";
import { CourseSidebarItem } from "./course-sidebar-item";

interface SidebarProps {
  className?: string;
  course: Course & {
    chapters: (Chapter & {
      userProgresses: UserProgress[];
    })[];
  };
  progress?: number;
}

export async function CourseSidebar({
  className,
  course,
  progress,
}: Readonly<SidebarProps>) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <aside className={cn(className)}>
      <div className={cn("flex justify-center items-center px-2")}>
        <h2 className={cn("text-primary font-black text-xl text-center")}>
          {course.title}
        </h2>
      </div>
      <ScrollArea className={cn("flex-1")}>
        <ul className={cn("flex flex-col")}>
          {course.chapters.map((chapter) => (
            <CourseSidebarItem
              key={chapter.id}
              courseId={course.id}
              chapter={chapter}
              purchase={purchase}
            />
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
}
