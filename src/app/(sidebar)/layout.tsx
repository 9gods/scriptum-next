import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import type { ReactNode } from "react";
import Providers from "../provider";

interface LayoutProp {
	children: ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProp>) {
	return (
		<body>
		<SidebarProvider>
			<AppSidebar />
			<main>
				<SidebarTrigger />
        <Providers>
          {children}
        </Providers>
			</main>
		</SidebarProvider>
		</body>
	);
}
