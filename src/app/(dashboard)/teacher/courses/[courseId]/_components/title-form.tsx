"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { default as axios } from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z as zod } from "zod";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { Course } from "~/lib/db";
import { cn } from "~/lib/utils";

interface TitleFormProps {
	courseId: string;
	initialData: Course;
}

const formSchema = zod.object({
	title: zod.string({ required_error: "Title is Required" }).min(3, {
		message: "Title must be at least 3 characters",
	}),
});

export function TitleForm({
	initialData,
	courseId,
}: TitleFormProps): ReactNode {
	const [isEditing, setIsEditing] = useState(false);

	const router = useRouter();

	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: initialData.title,
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, data);

			toast.success("Course Title Updated Successfully.");
			setIsEditing(!isEditing);
			router.refresh();
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		}
	});

	return !isEditing ? (
		<div className={cn("p-4 rounded-lg bg-muted")}>
			<div className={cn("flex justify-between items-center")}>
				<p className={cn("text-sm text-foreground/75")}>Course Title</p>
				<Button
					onClick={() => {
						setIsEditing(!isEditing);
					}}
					className={cn("flex items-center gap-2")}
					variant="ghost"
				>
					<Pencil size={16} />
					Edit Title
				</Button>
			</div>
			<p>{initialData.title}</p>
		</div>
	) : (
		<Form {...form}>
			<form
				onSubmit={onSubmit}
				className={cn("p-4 rounded-lg flex flex-col gap-4 bg-muted")}
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel className={cn("text-foreground/75")}>
								Course Title
							</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g. 'Advanced Web Development'"
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
