import type { ReactNode } from "react";

import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

interface AnalyticsSectionProps {
	className?: string;
}

export default function Page({
	className,
}: Readonly<AnalyticsSectionProps>): ReactNode {
	return (
		<section>
			<ScrollArea className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]", className)}>
				Analytics
			</ScrollArea>
		</section>
	);
}
