import type { ReactNode } from "react";

import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

export default function Page(): ReactNode {
	return (
		<section>
			<ScrollArea className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")}>
				Analytics
			</ScrollArea>
		</section>
	);
}
