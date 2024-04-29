"use client"

import {ReactNode, useState} from "react";
import type {Chapter} from "~/lib/db"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {z as zod} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {default as axios} from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {Checkbox} from "~/components/ui/checkbox";
import {Pencil} from "lucide-react";

interface ChapterAccessFormProps {
  courseId: string;
  chapterId: string;
  initialData: Chapter
}

const formSchema = zod.object({
  isFree: zod.boolean({required_error: "Chapter Access is Required"})
})

export function ChapterAccessForm({initialData, courseId, chapterId}: ChapterAccessFormProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: initialData.isFree || false
    }
  })

  const {isSubmitting, isValid} = form.formState

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data)

      toast.success("Chapter Access Updated Successfully.")
      setIsEditing(!isEditing)
      router.refresh()
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  });

  return (
    !isEditing
      ?
      <div className={cn("p-4 space-y-2 rounded-lg bg-muted")}>
        <div className={cn("flex justify-between items-center")}>
          <p className={cn("text-sm text-foreground/75")}>Chapter Access</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} className={cn("flex items-center gap-2")} variant="ghost">
            <Pencil size={16}/>
            Edit Chapter Access
          </Button>
        </div>
        <p
          className={cn(!initialData.description && "text-foreground/75 italic")}>{
          initialData.isFree !== undefined
            ? initialData.isFree ? "This chapter is free for preview" : "This is chapter is not free"
            : "No Description"}</p>
      </div>
      :
      <Form {...form}>
        <form onSubmit={onSubmit} className={cn("p-4 rounded-lg flex flex-col gap-4 bg-muted")}>
          <FormField
            control={form.control}
            name="isFree"
            render={({field}) => (
              <FormItem>
                <FormLabel className={cn("text-foreground/75")}>Chapter Access</FormLabel>
                <FormControl>
                  <div className={cn("flex items-center gap-2")}>
                    <Checkbox disabled={isSubmitting} checked={field.value} onCheckedChange={field.onChange}/>
                    <FormDescription>Check this to make this chapter free for preview</FormDescription>
                  </div>
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