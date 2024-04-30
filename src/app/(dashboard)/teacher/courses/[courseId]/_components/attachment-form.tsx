"use client";

import { default as axios } from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";
import { z as zod } from "zod";
import { FileUpload } from "~/components/common/file-upload";
import { Button } from "~/components/ui/button";
import type { Attachment, Course } from "~/lib/db";
import { cn } from "~/lib/utils";

interface AttachmentFormProps {
	courseId: string;
	initialData: Course & { attachments: Attachment[] };
}

const formSchema = zod.object({
	url: zod.string({ required_error: "Attachment is Required" }).url(),
});

export function AttachmentForm({
	initialData,
	courseId,
}: AttachmentFormProps): ReactNode {
	const [isEditing, setIsEditing] = useState(false);

	const router = useRouter();

	const onSubmit = async (data: zod.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/attachments`, data);

			toast.success("Course Attachment Added Successfully.");
			setIsEditing(!isEditing);
			router.refresh();
		} catch (error) {
			toast.error("An error occurred. Please try again later.");
		}
	};

	return !isEditing ? (
		<div className={cn("p-4 space-y-2 rounded-lg bg-muted")}>
			<div className={cn("flex justify-between items-center")}>
				<p className={cn("text-sm text-foreground/75")}>Course Attachments</p>
				<Button
					onClick={() => {
						setIsEditing(!isEditing);
					}}
					className={cn("flex items-center gap-2")}
					variant="ghost"
				>
					<Pencil size={16} />
					Add Attachment
				</Button>
			</div>
			{initialData.attachments.length > 0 ? (
				<p>{initialData.attachments.length} Attachment(s)</p>
			) : (
				<p className={cn("text-sm text-foreground/75 italic")}>
					No Attachments
				</p>
			)}
		</div>
	) : (
		<div className={cn("p-4 rounded-lg bg-muted")}>
			<div className={cn("flex justify-between items-center")}>
				<p className={cn("text-sm text-foreground/75")}>Course Attachment</p>
				<Button
					onClick={() => {
						setIsEditing(!isEditing);
					}}
					variant="outline"
				>
					Cancel
				</Button>
			</div>
			<FileUpload
				onChange={async (url) => {
					if (url) {
						await onSubmit({ url });
					}
				}}
				endpoint="courseAttachment"
			/>
		</div>
	);
}
