"use client"

import {ReactNode, useState} from "react";
import type {Chapter, Course} from "~/lib/db"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {z as zod} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {default as axios} from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";
import {Input} from "~/components/ui/input";
import {ChaptersList} from "~/app/(dashboard)/teacher/courses/[courseId]/_components/chapters-list";

interface ChapterFormProps {
  courseId: string;
  initialData: Course & { chapters: Chapter[] }
}

const formSchema = zod.object({
  title: zod.string({required_error: "Chapter Title is Required"}).min(3, {
    message: "Chapter Title must be at least 3 characters"
  }),
})

export function ChapterForm({initialData, courseId}: ChapterFormProps): ReactNode {
  const [isCreating, setIsCreating] = useState(false)
  const [_isUpdating, setIsUpdating] = useState(false)

  const router = useRouter()

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    }
  })

  const {isSubmitting, isValid} = form.formState

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, data)

      toast.success("Course Chapter Created Successfully.")
      setIsCreating(!isCreating)
      router.refresh()
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  });

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {list: updateData})

      toast.success("Course Chapters Reordered Successfully.")
      router.refresh()
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsCreating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    !isCreating
      ?

      <div className={cn("p-4 space-y-2 rounded-lg bg-muted")}>
        <div className={cn("flex justify-between items-center")}>
          <p className={cn("text-sm text-foreground/75")}>Course Chapter</p>
          <Button onClick={() => {
            setIsCreating(!isCreating)
          }} className={cn("flex items-center gap-2")} variant="ghost">
            <Pencil size={16}/>
            Add Chapter
          </Button>
        </div>
        {initialData.chapters.length > 0
          ?
          <>
            <p>{initialData.chapters.length} Chapter(s)</p>
            <ChaptersList
              onEdit={onEdit}
              onReorder={onReorder}
              items={initialData.chapters || []}
            />
          </>
          :
          <p className={cn("text-sm text-foreground/75 italic")}>No Chapters</p>
        }
      </div>
      :
      <Form {...form}>
        <form onSubmit={onSubmit} className={cn("p-4 rounded-lg flex flex-col gap-4 bg-muted")}>
          <FormField
            control={form.control}
            name="title"
            render={({field}) => (
              <FormItem>
                <FormLabel className={cn("text-foreground/75")}>Course Chapter</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 'This chapter is about...'" disabled={isSubmitting} {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <div className={cn("space-x-4")}>
            <Button onClick={() => {
              setIsCreating(!isCreating)
            }} variant="secondary" type="button">Cancel</Button>
            <Button disabled={isSubmitting || !isValid} variant="default" type="submit">Save</Button>
          </div>
        </form>
      </Form>
  )
}