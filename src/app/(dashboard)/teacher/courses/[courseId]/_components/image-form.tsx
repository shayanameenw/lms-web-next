"use client"

import {ReactNode, useState} from "react";
import type {Course} from "~/lib/db"
import {z as zod} from "zod";
import {default as axios} from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {ImageIcon, Pencil} from "lucide-react";
import Image from "next/image";
import {FileUpload} from "~/components/common/file-upload";

interface ImageFormProps {
  courseId: string;
  initialData: Course
}

const formSchema = zod.object({
  imageUrl: zod.string({required_error: "Image is Required"}).url(),
})

export function ImageForm({initialData, courseId}: ImageFormProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  const onSubmit = async (data: zod.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data)


      toast.success("Course Image Updated Successfully.")
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
          <p className={cn("text-sm text-foreground/75")}>Course Image</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} className={cn("flex items-center gap-2")} variant="ghost">
            <Pencil size={16}/>
            Edit Image
          </Button>
        </div>
        {initialData.imageUrl
          ?
          <div className={cn("relative overflow-hidden rounded-sm h-56 grid place-items-center bg-foreground/25")}>
            <Image src={initialData.imageUrl} alt={initialData.title} fill
                   className={cn("object-cover object-center")}/>
          </div>
          :
          <div className={cn("rounded-sm h-56 grid place-items-center bg-foreground/25")}>
            <ImageIcon size={40}/>
          </div>
        }
      </div>
      :
      <div className={cn("p-4 rounded-lg bg-muted")}>
        <div className={cn("flex justify-between items-center")}>
          <p className={cn("text-sm text-foreground/75")}>Course Image</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} variant="outline">
            Cancel
          </Button>
        </div>
        <FileUpload
          onChange={async (url) => {
            if (url) {
              await onSubmit({imageUrl: url})
            }
          }}
          endpoint="courseImage"
        />
      </div>
  )
}