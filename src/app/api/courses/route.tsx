import type { NextRequest as NextRequestType } from "next/server";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { default as db } from "~/lib/db";

export async function POST(request: NextRequestType): Promise<NextResponse> {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title } = await request.json();

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
