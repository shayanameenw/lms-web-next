import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { columns } from "~/app/(dashboard)/instructor/courses/_components/columns";
import { DataTable } from "~/app/(dashboard)/instructor/courses/_components/data-table";
import { ScrollArea } from "~/components/ui/scroll-area";
import { default as db } from "~/lib/db";
import { cn } from "~/lib/utils";

export default async function Page(): Promise<ReactNode> {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section>
      <ScrollArea className={cn("h-[calc(100vh_-_4rem)]")}>
        <div className={cn("my-4 mx-8 space-y-4")}>
          <DataTable
            columns={columns}
            data={courses}
          />
        </div>
      </ScrollArea>
    </section>
  );
}
