"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { default as axios } from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z as zod } from "zod";
import { Editor } from "~/components/common/editor";
import { Preview } from "~/components/common/preview";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import type { Chapter } from "~/lib/db";
import { cn } from "~/lib/utils";

interface ChapterDescriptionFormProps {
  courseId: string;
  chapterId: string;
  initialData: Chapter;
}

const formSchema = zod.object({
  description: zod
    .string({ required_error: "Chapter Description is Required" })
    .min(3, {
      message: "Chapter Description must be at least 3 characters",
    }),
});

export function ChapterDescriptionForm({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps): ReactNode {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data);

      toast.success("Chapter Description Updated Successfully.");
      setIsEditing(!isEditing);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  });

  return !isEditing ? (
    <div className={cn("p-4 space-y-2 rounded-lg bg-muted")}>
      <div className={cn("flex justify-between items-center")}>
        <p className={cn("text-sm text-foreground/75")}>Chapter Description</p>
        <Button
          onClick={() => {
            setIsEditing(!isEditing);
          }}
          className={cn("flex items-center gap-2")}
          variant="ghost"
        >
          <Pencil size={16} />
          Edit Chapter Description
        </Button>
      </div>
      <div
        className={cn(!initialData.description && "text-foreground/75 italic")}
      >
        {initialData.description ? (
          <Preview value={initialData.description} />
        ) : (
          "No Description"
        )}
      </div>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn("p-4 rounded-lg flex flex-col gap-4 bg-muted")}
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn("text-foreground/75")}>
                Chapter Description
              </FormLabel>
              <FormControl>
                <Editor
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={cn("space-x-4")}>
          <Button
            onClick={() => {
              setIsEditing(!isEditing);
            }}
            variant="secondary"
            type="button"
          >
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || !isValid}
            variant="default"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
