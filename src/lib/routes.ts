import { BarChart, Compass, Layout, List } from "lucide-react";

export const guestsRoutes = [
	{
		Icon: Layout,
		label: "Dashboard",
		url: "/",
	},
	{
		Icon: Compass,
		label: "Browse",
		url: "/courses",
	},
];

export const teacherRoutes = [
	{
		Icon: BarChart,
		label: "Analytics",
		url: "/teacher",
	},
	{
		Icon: List,
		label: "Courses",
		url: "/teacher/courses",
	},
];
