import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { IconBadge } from "~/components/common/icon-badge";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface InfoCardProps {
  Icon: LucideIcon;
  title: string;
  count: number;
}

export function InfoCard({
  Icon,
  title,
  count,
}: Readonly<InfoCardProps>): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex gap-2 items-center")}>
          <IconBadge
            size="lg"
            variant="secondary"
            Icon={Icon}
          />
          <div className={cn("")}>
            <h3 className={cn("text-lg font-semibold")}>{title}</h3>
            <p className={cn("text-sm font-normal")}>
              {`${count} ${count === 1 ? "course" : "courses"}`}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
