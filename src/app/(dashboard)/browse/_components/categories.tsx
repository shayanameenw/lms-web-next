"use client";

import type { Category } from "~/lib/db";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
	ActivityIcon,
	FileCogIcon,
	ImageIcon,
	MusicIcon,
	TabletSmartphoneIcon,
	TelescopeIcon,
	VideoIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { default as qs } from "query-string";

interface CategoriesProps {
	items: Category[];
}

const iconMap: Record<Category["name"], LucideIcon> = {
	Accounting: ActivityIcon,
	"Computer Science": TabletSmartphoneIcon,
	"Data Science": FileCogIcon,
	Engineering: TelescopeIcon,
	Filming: VideoIcon,
	Music: MusicIcon,
	Photography: ImageIcon,
};

interface CategoryItemProps {
	label: string;
	Icon: LucideIcon;
	value: string;
}

export function CategoryItem({
	Icon,
	label,
	value,
}: Readonly<CategoryItemProps>): ReactNode {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentBrowseValue = searchParams.get("browse");
	const currentCategory = searchParams.get("category");

	const isSelected = currentCategory === value;

	const categoryClickHandler = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					browse: currentBrowseValue,
					category: isSelected ? null : value,
				},
			},
			{ skipNull: true, skipEmptyString: true },
		);

		router.push(url);
	};

	return (
		<Button
			onClick={categoryClickHandler}
			className={cn("rounded-3xl gap-2")}
			variant={isSelected ? "default" : "outline"}
		>
			<Icon size={20} />
			<span className={cn("truncate")}>{label}</span>
		</Button>
	);
}

export function Categories({ items }: Readonly<CategoriesProps>): ReactNode {
	return (
		<ScrollArea
			className={cn(
				"w-[calc(100vw_-_4rem)] md:w-[calc(100vw_-_16rem_-_4rem)] pb-3",
			)}
		>
			<ul className={cn("flex")}>
				{items.map((item) => {
					return (
						<li key={item.id}>
							<CategoryItem
								label={item.name}
								Icon={iconMap[item.name]}
								value={item.id}
							/>
						</li>
					);
				})}
			</ul>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
