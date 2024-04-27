import type {ReactNode} from "react";
import {notFound, redirect} from "next/navigation";
import {auth} from "@clerk/nextjs/server";
import {LayoutDashboard} from "lucide-react";
import {ScrollArea} from "~/components/ui/scroll-area";
import {IconBadge} from "~/components/common/icon-badge";
import {TitleForm} from "~/app/(dashboard)/teacher/courses/[courseId]/_components/title-form";
import {DescriptionForm} from "~/app/(dashboard)/teacher/courses/[courseId]/_components/description-form";
import {ImageForm} from "~/app/(dashboard)/teacher/courses/[courseId]/_components/image-form";
import {cn} from "~/lib/utils";
import {default as db} from "~/lib/db";
import {CategoryForm} from "~/app/(dashboard)/teacher/courses/[courseId]/_components/category-form";

export default async function Page({params}: { params: { courseId: string } }): Promise<ReactNode> {
  const {userId} = auth()

  if (!userId) {
    return redirect("/sign-in")
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId
    }
  })

  if (!course) {
    return notFound()
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields} / ${totalFields})`


  return (
    <section>
      <ScrollArea className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")}>
        <div className={cn("space-y-6")}>
          <div className={cn("space-y-2")}>
            <h2 className={cn("font-bold text-2xl")}>Course Setup</h2>
            <p className={cn("text-sm text-foreground/70")}>Complete all fields {completionText}</p>
          </div>
          <div className={cn("grid lg:grid-cols-2 items-start gap-4")}>
            <div className={cn("space-y-4")}>
              <div className={cn("col-span-2 mb-8 flex gap-2 items-center")}>
                <IconBadge size="sm" Icon={LayoutDashboard}/>
                <h3 className={cn("text-xl")}>Customize your course</h3>
              </div>
              <TitleForm initialData={course} courseId={course.id}/>
              <DescriptionForm initialData={course} courseId={course.id}/>
              <ImageForm initialData={course} courseId={course.id}/>
              <CategoryForm
                options={categories.map(category => ({label: category.name, value: category.id}))}
                initialData={course} courseId={course.id}
              />
              <TitleForm initialData={course} courseId={course.id}/>
              <TitleForm initialData={course} courseId={course.id}/>
            </div>
          </div>
        </div>
      </ScrollArea>
    </section>
  )
}
