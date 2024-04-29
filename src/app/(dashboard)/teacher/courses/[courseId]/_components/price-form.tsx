"use client"

import type {ReactNode} from "react";
import type {Course} from "~/lib/db"
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z as zod} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {default as axios} from "axios";
import {toast} from "sonner";
import {Pencil} from "lucide-react";
import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {formatCurrencyUS} from "~/lib/format";
import {cn} from "~/lib/utils";

interface PriceFormProps {
  courseId: string;
  initialData: Course
}

const formSchema = zod.object({
  price: zod.coerce.number({required_error: "Price is Required"}),
})

export function PriceForm({initialData, courseId}: PriceFormProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || 0
    }
  })

  const {isSubmitting, isValid} = form.formState

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data)


      toast.success("Course Price Updated Successfully.")
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
          <p className={cn("text-sm text-foreground/75")}>Course Price</p>
          <Button onClick={() => {
            setIsEditing(!isEditing)
          }} className={cn("flex items-center gap-2")} variant="ghost">
            <Pencil size={16}/>
            Edit Price
          </Button>
        </div>
        <p
          className={cn(!initialData.price && "text-foreground/75 italic")}>
          {initialData.price ? formatCurrencyUS(initialData.price) : "No Price"}
        </p>
      </div>
      :
      <Form {...form}>
        <form onSubmit={onSubmit} className={cn("p-4 rounded-lg flex flex-col gap-4 bg-muted")}>
          <FormField
            control={form.control}
            name="price"
            render={({field}) => (
              <FormItem>
                <FormLabel className={cn("text-foreground/75")}>Course Price</FormLabel>
                <FormControl>
                  <Input type="number" step={0.01} placeholder="e.g. 'Set a price for your course...'"
                         disabled={isSubmitting} {...field} />
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