"use client";

import type { ReactNode } from "react";

import { default as MuxPlayer } from "@mux/mux-player-react";
import { default as axios } from "axios";
import { Loader2Icon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type VideoPlayerProps = {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId: string | undefined;
  playbackId: string | undefined | null;
  isLocked: boolean;
  completedOnEnd: boolean;
};

export function VideoPlayer({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completedOnEnd,
}: Readonly<VideoPlayerProps>): ReactNode {
  const [isReady, setIsReady] = useState(false);

  return (
    <Card
      className={cn(
        "bg-foreground text-background dark:bg-foreground/25 dark:text-foreground",
      )}
    >
      <CardContent
        className={cn(
          "aspect-video flex flex-col gap-4 justify-center items-center p-0",
        )}
      >
        {isLocked ? (
          <>
            <LockIcon size={36} />
            <p>This Chapter is Locked!</p>
          </>
        ) : (
          <>
            <MuxPlayer
              className={cn(!isReady && "hidden rounded-lg")}
              autoPlay
              playbackId={playbackId as string | undefined}
              title={title}
              onCanPlay={() => setIsReady(true)}
              onEnded={() => {
                completedOnEnd ? "" : "";
              }}
            />
            {!isReady && (
              <Loader2Icon
                className={cn("animate-spin")}
                size={36}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
