import type {ReactNode} from "react";
import {default as Link} from "next/link";
import {Button} from "~/components/ui/button";
import {cn} from "~/lib/utils";

export default function Page(): ReactNode {
  return (
    <section className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")}>
      <Link href="/teacher/courses/create">
        <Button>
          New Course
        </Button>
      </Link>
    </section>
  )
}
