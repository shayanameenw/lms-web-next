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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {Button} from "~/components/ui/button";
import {Pencil} from "lucide-react";

interface CategoryFormProps {
  courseId: string;
  initialData: Course
  options: { label: string; value: string }[]
}

const formSchema = zod.object({
  categoryId: zod.string({required_error: "Category is Required"}).min(1, {
    message: "Description must be at least 1 characters"
  }),
})

export function CategoryForm({options, initialData, courseId}: CategoryFormProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || ""
    }
  })

  const {isSubmitting, isValid} = form.formState

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data)

      toast.success("Course Category Updated Successfully.")
      setIsEditing(!isEditing)
      router.refresh()
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  });

  const selectedOption = options.find(option => option.value === initialData.categoryId)

  return (
    !isEditing
      ?
      <div className={cn("p-4 space-y-2 rounded-lg bg-muted")}>
        <div className={cn("flex justify-between items-center")}>
          <p className={cn("text-sm text-foreground/75")}>Course Category</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} className={cn("flex items-center gap-2")} variant="ghost">
            <Pencil size={16}/>
            Edit Category
          </Button>
        </div>
        <p
          className={cn(!initialData.categoryId && "text-foreground/75 italic")}>{selectedOption?.label || "No Category"}</p>
      </div>
      :
      <Form {...form}>
        <form onSubmit={onSubmit} className={cn("p-4 rounded-lg flex flex-col gap-4 bg-muted")}>
          <FormField
            control={form.control}
            name="categoryId"
            render={({field}) => {
              console.log(field)

              return <FormItem>
                <FormLabel className={cn("text-foreground/75")}>Course Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map(option => (
                      <SelectItem value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            }}
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