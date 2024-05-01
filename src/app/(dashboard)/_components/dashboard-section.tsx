import type { ReactNode } from "react";

import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

interface DashboardSectionProps {
	className?: string;
}

export function DashboardSection({
	className,
}: Readonly<DashboardSectionProps>): ReactNode {
	return (
		<section>
			<ScrollArea className={cn("h-full", className)}>Dashboard</ScrollArea>
		</section>
	);
}
