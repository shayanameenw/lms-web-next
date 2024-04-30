"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { default as axios } from "axios";
import { default as Link } from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z as zod } from "zod";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

const formSchema = zod.object({
	title: zod.string({ required_error: "Title is Required" }).min(3),
});

export default function Page(): ReactNode {
	const router = useRouter();

	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			const response = await axios.post("/api/courses", data);

			router.push(`/teacher/courses/${response.data.id}`);
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		}
	});

	return (
		<section className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")}>
			<div
				className={cn(
					"mx-auto max-w-3xl h-full md:flex flex-col justify-center",
				)}
			>
				<div>
					<h2 className={cn("text-2xl")}>Name your course</h2>
					<p className={cn("text-sm text-foreground/50")}>
						What would you like to name your course? Don&apos;t worry you can
						change it later.
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={onSubmit} className={cn("mt-8 flex flex-col gap-8")}>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course Title</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g. 'Advanced Web Development'"
											disabled={isSubmitting}
											{...field}
										/>
									</FormControl>
									<FormDescription>
										What will you teach in this course?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className={cn("space-x-4")}>
							<Link href="/">
								<Button variant="secondary" type="button">
									Cancel
								</Button>
							</Link>
							<Button
								disabled={isSubmitting || !isValid}
								variant="default"
								type="submit"
							>
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</section>
	);
}
