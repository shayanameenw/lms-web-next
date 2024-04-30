import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

const iconBadgeVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
			},
			size: {
				default: "h-10 w-10 p-2",
				sm: "h-8 w-8 rounded-md p-1.5",
				lg: "h-12 w-12 rounded-md p-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type IconBadgeVariantsProps = VariantProps<typeof iconBadgeVariants>;

interface IconBadgeProps extends IconBadgeVariantsProps {
	Icon: LucideIcon;
}

export function IconBadge({ Icon, variant, size }: IconBadgeProps): ReactNode {
	return (
		<div className={cn(iconBadgeVariants({ variant, size }))}>
			<Icon />
		</div>
	);
}
