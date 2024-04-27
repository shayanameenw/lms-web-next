import {ReactNode} from "react";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin";
import {extractRouterConfig} from "uploadthing/server";
import {ourFileRouter} from "~/app/api/uploadthing/core";

export function UploadthingProvider(): ReactNode {
  return <NextSSRPlugin
    routerConfig={extractRouterConfig(ourFileRouter)}
  />
}