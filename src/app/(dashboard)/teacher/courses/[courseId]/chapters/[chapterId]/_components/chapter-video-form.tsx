"use client"

import {ReactNode, useState} from "react";
import type {Chapter, MuxData} from "~/lib/db"
import {z as zod} from "zod";
import {default as axios} from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {Video, Pencil} from "lucide-react";
import {FileUpload} from "~/components/common/file-upload";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  courseId: string;
  chapterId: string;
  initialData: Chapter & { muxData?: MuxData | null }
}

const formSchema = zod.object({
  videoUrl: zod.string({required_error: "Video is Required"}).url(),
})

export function ChapterVideoForm({initialData, courseId, chapterId}: ChapterVideoFormProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  const onSubmit = async (data: zod.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data)

      toast.success("Chapter Video Updated Successfully.")
      setIsEditing(!isEditing)
      router.refresh()
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    !isEditing
      ?
      <div className={cn("p-4 space-y-2 rounded-lg bg-muted")}>
        <div className={cn("flex justify-between items-center")}>
          <p className={cn("text-sm text-foreground/75")}>Chapter Video</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} className={cn("flex items-center gap-2")} variant="ghost">
            <Pencil size={16}/>
            Edit Chapter Video
          </Button>
        </div>
        {initialData.videoUrl
          ?
          <div className={cn("relative overflow-hidden rounded-sm h-56 grid place-items-center bg-foreground/25")}>
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}/>
          </div>
          :
          <div className={cn("rounded-sm h-56 grid place-items-center bg-foreground/25")}>
            <Video size={40}/>
          </div>
        }
      </div>
      :
      <div className={cn("p-4 rounded-lg bg-muted")}>
        <div className={cn("flex justify-between items-center")}>
          <p className={cn("text-sm text-foreground/75")}>Chapter Video</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} variant="outline">
            Cancel
          </Button>
        </div>
        <FileUpload
          onChange={async (url) => {
            if (url) {
              await onSubmit({videoUrl: url})
            }
          }}
          endpoint="chapterVideo"
        />
      </div>
  )
}