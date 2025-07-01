"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ZustandProvider } from "@/components/providers/zustand-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ZustandProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </ZustandProvider>
    </SessionProvider>
  );
}