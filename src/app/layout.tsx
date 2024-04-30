import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import type { PropsWithChildren, ReactNode } from "react";
import { ToasterProvider } from "~/components/providers/toaster-provider";
import { UploadthingProvider } from "~/components/providers/uploadthing-provider";
import { secondaryFont } from "~/lib/fonts";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/providers/theme-provider";
import "~/styles/globals.css";

export const metadata: Metadata = {
	title: "LMS Web Next",
};

export default function Layout({
	children,
}: Readonly<PropsWithChildren>): ReactNode {
	return (
		<ClerkProvider>
			<html suppressHydrationWarning lang="en">
				<body className={cn(secondaryFont.className)}>
					<ThemeProvider
						disableTransitionOnChange
						enableSystem
						attribute="class"
						defaultTheme="system"
					>
						<UploadthingProvider />
						{children}
						<ToasterProvider />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
