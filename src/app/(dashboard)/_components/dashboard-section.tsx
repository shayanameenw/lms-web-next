import type { AwaitedReactNode } from "react";

import { auth } from "@clerk/nextjs/server";
import { ClockIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "~/app/(dashboard)/_components/info-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getDashboardCourses } from "~/lib/queries";
import { cn } from "~/lib/utils";
import { CourseList } from "../courses/_components/course-list";

export async function DashboardSection(): Promise<AwaitedReactNode> {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const dashboard = await getDashboardCourses({ userId });

  if (!dashboard) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = dashboard;

  return (
    <section>
      <ScrollArea className={cn("h-[calc(100vh_-_4rem)]")}>
        <div className={cn("py-4 px-8 space-y-4")}>
          <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4")}>
            <InfoCard
              Icon={ClockIcon}
              title="Courses in Progress"
              count={coursesInProgress.length}
            />
            <InfoCard
              Icon={ClockIcon}
              title="Completed Courses"
              count={coursesInProgress.length}
            />
          </div>
          <CourseList items={[...coursesInProgress, ...completedCourses]} />
        </div>
      </ScrollArea>
    </section>
  );
}
