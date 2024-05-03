import type { AwaitedReactNode } from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { getAnalytics } from "~/queries/get-analytics";
import { Chart } from "./chart";
import { DataCard } from "./data-card";

export async function AnalyticsSection(): Promise<AwaitedReactNode> {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const analytics = await getAnalytics({ userId });

  if (!analytics) {
    return redirect("/");
  }

  const { data, totalRevenue, totalSales } = analytics;

  return (
    <section>
      <ScrollArea className={cn("h-[calc(100vh_-_4rem)]")}>
        <div className={cn("py-4 px-8 space-y-4")}>
          <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4")}>
            <DataCard
              value={totalSales}
              label="Sales"
              shouldFormat={false}
            />
            <DataCard
              value={totalRevenue}
              label="Revenue"
              shouldFormat={true}
            />
          </div>
          <Chart data={data} />
        </div>
      </ScrollArea>
    </section>
  );
}
