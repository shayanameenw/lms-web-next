import type {ReactNode} from "react";
import db from "~/lib/db";
import {default as Link} from "next/link";
import {Button} from "~/components/ui/button";
import {cn} from "~/lib/utils";
import {columns} from "~/app/(dashboard)/teacher/courses/_components/columns";
import {DataTable} from "~/app/(dashboard)/teacher/courses/_components/data-table";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {ScrollArea} from "~/components/ui/scroll-area";

export default async function Page(): Promise<ReactNode> {
  const {userId} = auth()

  if (!userId) {
    return redirect("/sign-in")
  }

  const courses = await db.course.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <section>
      <ScrollArea className={cn("h-[calc(100vh_-_4rem)]")}>
        <div className={cn("my-4 mx-8 space-y-4")}>
          <DataTable columns={columns} data={courses}/>
        </div>
      </ScrollArea>
    </section>
  )
}
