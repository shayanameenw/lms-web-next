import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { BrowseSection } from "~/app/(dashboard)/browse/_components/browse-section";
import { default as db } from "~/lib/db";
import { cn } from "~/lib/utils";
import { getCourses } from "~/queries/get-courses";

export default async function Page({
	searchParams,
}: {
	searchParams: { title: string; categoryId: string };
}): Promise<ReactNode> {
	const { userId } = auth();

	if (!userId) {
		return redirect("/sign-in");
	}

	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});

	const courses = await getCourses({ userId, ...searchParams });

	return (
		<>
			<BrowseSection
				categories={categories}
				className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")}
				courses={courses}
			/>
		</>
	);
}
