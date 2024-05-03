import db from "~/lib/db";

interface GetChapterProps {
	userId: string;
	courseId: string;
	chapterId: string;
}

export async function getChapter({
	userId,
	courseId,
	chapterId,
}: Readonly<GetChapterProps>) {
	try {
		const chapter = await db.chapter.findUnique({
			where: {
				id: chapterId,
				isPublished: true,
				courseId,
				course: {
					isPublished: true,
					userId,
				},
			},
			include: {
				course: {
					include: {
						chapters: {
							orderBy: {
								position: "asc",
							},
						},
						attachments: true,
						purchases: {
							where: { userId },
						},
					},
				},
				muxData: true,
				userProgresses: {
					where: {
						userId,
					},
				},
			},
		});

		if (!chapter) {
			return;
		}

		if (!chapter.isFree && chapter.course.purchases.length < 1) {
			chapter.course.chapters = chapter.course.chapters.filter(
				(currChapter) => currChapter.id === chapter.id,
			);
			chapter.course.attachments = [];
			chapter.userProgresses = [];
			chapter.muxData = null;
		}

		return chapter;
	} catch (error) {
		console.log("[GET_CHAPTER]", error);
	}
}
