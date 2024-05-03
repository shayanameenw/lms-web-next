"use client";

import { default as axios } from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ChapterActionsProps {
	isPublished: boolean;
	courseId: string;
	chapterId: string;
	disabled: boolean;
}

export function ChapterActions({
	isPublished,
	courseId,
	chapterId,
	disabled,
}: Readonly<ChapterActionsProps>): ReactNode {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const statusHandler = async () => {
		try {
			setIsLoading(true);

			if (isPublished) {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/unpublish`,
				);
			} else {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/publish`,
				);
			}

			toast.success(
				`Chapter ${isPublished ? "Unpublished" : "Published"} Successfully.`,
			);
			router.refresh();
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	const deleteHandler = async () => {
		try {
			setIsLoading(true);

			await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

			toast.success("Chapter Deleted Successfully.");
			router.refresh();
			router.push(`/teacher/courses/${courseId}`);
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex items-center gap-2")}>
			<Button
				onClick={statusHandler}
				size="sm"
				variant="outline"
				disabled={(disabled && true) || isLoading}
			>
				{!isPublished ? "Publish" : "Unpublish"}
			</Button>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button size="sm" variant="destructive" disabled={isLoading}>
						<Trash size={16} />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={deleteHandler}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
