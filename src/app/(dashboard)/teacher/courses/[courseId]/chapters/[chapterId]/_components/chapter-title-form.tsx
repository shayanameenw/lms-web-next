"use client"

import {ReactNode, useState} from "react";
import type {Chapter} from "~/lib/db"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {z as zod} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {default as axios} from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "~/lib/utils";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";

interface ChapterTitleFormProps {
  courseId: string;
  chapterId: string;
  initialData: Chapter
}

const formSchema = zod.object({
  title: zod.string({required_error: "Title is Required"}).min(3, {
    message: "Title must be at least 3 characters"
  }),
})

export function ChapterTitleForm({initialData, courseId, chapterId}: ChapterTitleFormProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title
    }
  })

  const {isSubmitting, isValid} = form.formState

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data)

      toast.success("Chapter Title Updated Successfully.")
      setIsEditing(!isEditing)
      router.refresh()
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  });

  return (
    !isEditing
      ?
      <div className={cn("p-4 rounded-lg bg-muted")}>
        <div className={cn("flex justify-between items-center")}>
          <p className={cn("text-sm text-foreground/75")}>Chapter Title</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} className={cn("flex items-center gap-2")} variant="ghost">
            <Pencil size={16}/>
            Edit Chapter Title
          </Button>
        </div>
        <p>{initialData.title}</p>
      </div>
      :
      <Form {...form}>
        <form onSubmit={onSubmit} className={cn("p-4 rounded-lg flex flex-col gap-4 bg-muted")}>
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel className={cn("text-foreground/75")}>Chapter Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 'Introduction to Web Development'" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <div className={cn("space-x-4")}>
            <Button onClick={() => {
              setIsEditing(!isEditing)
            }} variant="secondary" type="button">Cancel</Button>
            <Button disabled={isSubmitting || !isValid} variant="default" type="submit">Save</Button>
          </div>
        </form>
      </Form>
  )
}