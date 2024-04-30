import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { Chapter } from "~/lib/db";
import { cn } from "~/lib/utils";

interface ChaptersListProps {
	onEdit: (id: string) => void;
	onReorder: (updateData: { id: string; position: number }[]) => void;
	items: Chapter[];
}

export function ChaptersList({
	items,
	onEdit,
	onReorder,
}: ChaptersListProps): ReactNode {
	const [isMounted, setIsMounted] = useState(false);
	const [chapters, setChapters] = useState(items);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setChapters(items);
	}, [items]);

	const dragEndHandler = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		const { source, destination } = result;

		if (source.index === destination.index) {
			return;
		}

		const items = Array.from(chapters);
		const [updatedItem] = items.splice(source.index, 1);
		items.splice(destination.index, 0, updatedItem);

		const startIndex = Math.min(source.index, destination.index);
		const endIndex = Math.max(source.index, destination.index);

		const updatedChapters = items.slice(startIndex, endIndex + 1);

		setChapters(items);

		const bulkUpdateData = updatedChapters.map((chapter) => {
			return {
				id: chapter.id,
				position: items.findIndex((item) => item.id === chapter.id),
			};
		});

		onReorder(bulkUpdateData);
	};

	if (!isMounted) {
		return;
	}

	return (
		<DragDropContext onDragEnd={dragEndHandler}>
			<Droppable droppableId="chapters">
				{(provided) => {
					return (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{chapters.map((chapter, index) => {
								return (
									<Draggable
										key={chapter.id}
										draggableId={chapter.id}
										index={index}
									>
										{(provided) => {
											return (
												<div
													className={cn(
														"mb-2 flex items-center gap-2 bg-background/75 border-background/75 text-foreground/75 rounded-md text-sm",
														chapter.isPublished &&
															"bg-primary/15 border-primary/25 text-primary",
													)}
													{...provided.draggableProps}
													ref={provided.innerRef}
												>
													<div
														className={cn(
															"p-2 border-r border-r-background/25 rounded-l-md hover:bg-background/25 transition",
														)}
														{...provided.dragHandleProps}
													>
														<Grip size={20} />
													</div>
													<p>{chapter.title}</p>
													<div
														className={cn(
															"ml-auto mr-2 flex items-center gap-2",
														)}
													>
														{chapter.isFree && <Badge>Free</Badge>}
														<Badge
															variant={
																chapter.isPublished ? "default" : "secondary"
															}
														>
															{chapter.isPublished ? "Published" : "Draft"}
														</Badge>
														<Button
															onClick={() => {
																onEdit(chapter.id);
															}}
															size="icon"
															variant="ghost"
														>
															<Pencil size={20} />
														</Button>
													</div>
												</div>
											);
										}}
									</Draggable>
								);
							})}
							{provided.placeholder}
						</div>
					);
				}}
			</Droppable>
		</DragDropContext>
	);
}
