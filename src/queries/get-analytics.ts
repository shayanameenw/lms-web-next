import type { Course, Purchase } from "~/lib/db";
import { default as db } from "~/lib/db";
import { getProgress } from "~/lib/queries";

export type PurchaseWithCourse = Purchase & {
  course: Course;
};

function groupByCourse(purchases: PurchaseWithCourse[]) {
  const grouped: { [courseTitle: string]: number } = {};

  for (const purchase of purchases) {
    const { title, price } = purchase.course;

    if (!grouped[title]) {
      grouped[title] = 0;
    }

    grouped[title] += price as number;
  }

  return grouped;
}

export async function getAnalytics({
  userId,
}: {
  userId: string;
}) {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    });

    const gropedEarnings = groupByCourse(purchases as PurchaseWithCourse[]);

    const data = Object.entries(gropedEarnings).map(([title, price]) => ({
      title,
      price,
    }));

    const totalRevenue = data.reduce((acc, { price }) => acc + price, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("GET_ANALYTICS", error);
  }
}
