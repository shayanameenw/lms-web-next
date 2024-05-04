"use client";

import type { ReactNode } from "react";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type ChartProps = {
  data: {
    title: string;
    price: number;
  }[];
};

export function Chart({ data }: Readonly<ChartProps>): ReactNode {
  return (
    <Card>
      <ResponsiveContainer
        width="100%"
        height={256}
      >
        <BarChart data={data}>
          <XAxis dataKey="title" />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <Bar
            dataKey="price"
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
