import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
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
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </Providers>
			</main>
		</SidebarProvider>
		</body>
	);
}
