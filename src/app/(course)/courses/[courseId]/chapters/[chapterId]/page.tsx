import type { ReactNode } from "react";

import { auth } from "@clerk/nextjs/server";
import { CheckCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { VideoPlayer } from "~/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/video-player";
import { Preview } from "~/components/common/preview";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { formatCurrencyUS } from "~/lib/format";
import { getChapter } from "~/lib/queries";
import { cn } from "~/lib/utils";

export default async function Page({
  params,
}: { params: { courseId: string; chapterId: string } }): Promise<ReactNode> {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const {
    chapter,
    course,
    attachments,
    muxData,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  });

  if (!course || !chapter) {
    return redirect("/courses");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completedOnEnd = !!purchase && !userProgress?.isCompleted;
  return (
    <section>
      <ScrollArea className={cn("h-[calc(100vh_-_4rem)]")}>
        <div className={cn("my-4 mx-8 space-y-6")}>
          {userProgress?.isCompleted && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Completed!</AlertTitle>
              <AlertDescription>
                You have already completed this chapter.
              </AlertDescription>
            </Alert>
          )}
          {isLocked && (
            <Alert variant="destructive">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Locked!</AlertTitle>
              <AlertDescription>
                You have already purchase this course to unlock this chapter.
              </AlertDescription>
            </Alert>
          )}
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId}
            isLocked={isLocked}
            completedOnEnd={completedOnEnd}
          />
          <div className={cn("flex gap-4 items-center justify-between")}>
            <h2>{chapter.title}</h2>
            <Button disabled={!!purchase}>
              {!purchase
                ? `Enroll for ${formatCurrencyUS(course.price as number)}`
                : "Enrolled"}
            </Button>
          </div>
          <Preview value={chapter.description as string} />
          <ul>
            {attachments.map((attachment) => {
              return (
                <li key={attachment.id}>
                  <a
                    target="_blank"
                    href={attachment.url}
                    rel="noreferrer"
                  >
                    {attachment.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </ScrollArea>
    </section>
  );
}
