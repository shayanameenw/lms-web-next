import type { ReactNode } from "react";
import { DashboardSection } from "~/app/(dashboard)/_components/dashboard-section";
import { cn } from "~/lib/utils";

export default function Page(): ReactNode {
	return (
		<>
			<DashboardSection className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")} />
		</>
	);
}
