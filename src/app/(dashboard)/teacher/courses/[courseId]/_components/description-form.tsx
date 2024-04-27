"use client"

import {ReactNode, useState} from "react";
import type {Course} from "~/lib/db"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {z as zod} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {default as axios} from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {cn} from "~/lib/utils";
import {Textarea} from "~/components/ui/textarea";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";

interface DescriptionFormProps {
  courseId: string;
  initialData: Course
}

const formSchema = zod.object({
  description: zod.string({required_error: "Description is Required"}).min(3, {
    message: "Description must be at least 3 characters"
  }),
})

export function DescriptionForm({initialData, courseId}: DescriptionFormProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || ""
    }
  })

  const {isSubmitting, isValid} = form.formState

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data)


      toast.success("Course Description Updated Successfully.")
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
        <p className={cn("text-sm text-foreground/75")}>Description Title</p>
        <div className={cn("flex justify-between items-start")}>
          <p
            className={cn(!initialData.description && "text-foreground/75 italic")}>{initialData.description || "No Description"}</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} className={cn("flex items-center gap-2")} variant="ghost">
            <Pencil size={16}/>
            Edit Description
          </Button>
        </div>
      </div>
      :
      <Form {...form}>
        <form onSubmit={onSubmit} className={cn("p-4 rounded-lg flex flex-col gap-4 bg-muted")}>
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem>
                <FormLabel className={cn("text-foreground/75")}>Course Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g. 'This course is about...'" disabled={isSubmitting} {...field} />
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