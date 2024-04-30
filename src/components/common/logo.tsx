import type { ReactNode } from "react";
import { primaryFont } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export function Logo(): ReactNode {
	return (
		<div className={cn("flex justify-center items-center gap-4")}>
			<h1
				className={cn(
					primaryFont.className,
					"text-primary font-black text-3xl",
				)}
			>
				LMS
			</h1>
		</div>
	);
}
