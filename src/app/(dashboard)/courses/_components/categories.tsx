"use client";

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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { default as qs } from "query-string";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import type { Category } from "~/lib/db";
import { cn } from "~/lib/utils";

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

	const currentTitle = searchParams.get("title");
	const currentCategoryId = searchParams.get("categoryId");

	const isSelected = currentCategoryId === value;

	const categoryClickHandler = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					title: currentTitle,
					categoryId: isSelected ? null : value,
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
			size="sm"
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
			<ul className={cn("flex gap-2")}>
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
