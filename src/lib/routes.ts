import {BarChart, Compass, Layout, List} from "lucide-react";

export const guestsRoutes = [
  {
    Icon: Layout,
    label: "Dashboard",
    url: "/",
  },
  {
    Icon: Compass,
    label: "Browse",
    url: "/browse",
  },
]

export const teacherRoutes = [
  {
    Icon: List,
    label: "Courses",
    url: "/teacher/courses",
  },
  {
    Icon: BarChart,
    label: "Analytics",
    url: "/teacher/analytics",
  },
]
