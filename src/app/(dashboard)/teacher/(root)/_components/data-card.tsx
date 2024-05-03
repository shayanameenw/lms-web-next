import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatCurrencyUS } from "~/lib/format";
import { cn } from "~/lib/utils";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat: boolean;
}

export function DataCard({
  value,
  label,
  shouldFormat,
}: Readonly<DataCardProps>): ReactNode {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("text-sm font-medium")}>{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        {shouldFormat ? formatCurrencyUS(value) : value}
      </CardContent>
    </Card>
  );
}
