"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/use-auth-store";

interface ZustandProviderProps {
  children: React.ReactNode;
}

export function ZustandProvider({ children }: ZustandProviderProps) {
  useEffect(() => {
    // Forçar hidratação do store de autenticação
    useAuthStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
} 