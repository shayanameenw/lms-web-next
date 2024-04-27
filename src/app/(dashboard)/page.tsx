import type {ReactNode} from "react";
import {cn} from "~/lib/utils";
import {DashboardSection} from "~/app/(dashboard)/_components/dashboard-section";

export default function Page(): ReactNode {
  return (
    <>
      <DashboardSection className={cn("py-4 px-8 h-[calc(100vh_-_4rem)]")}/>
    </>
  );
}
