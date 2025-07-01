"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";
import { Loader2 } from "lucide-react";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isChecking } = useAuthGuard();

  // Mostrar loading enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (o hook já redireciona)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
} 