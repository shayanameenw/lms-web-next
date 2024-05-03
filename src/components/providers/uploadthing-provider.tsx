import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { ReactNode } from "react";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "~/app/api/uploadthing/core";

export function UploadthingProvider(): ReactNode {
  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
}
