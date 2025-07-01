"use client";

import {FlickeringParticles} from "@/components/animations/flickering-particles";
import {ModeToggle} from "@/components/mode-toggle";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {SigninForm} from "@/components/auth/signin-form";
import { useBackendHealth } from "@/hooks/use-backend-health";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";

export default function Page() {
  const { isHealthy, isChecking, error } = useBackendHealth();

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <Card className="z-10 min-w-sm">
        <CardHeader>
          <CardTitle>Entrar no Scriptum</CardTitle>
          <CardDescription>
            Insira seu email e senha, ou acesse sua conta Google.
          </CardDescription>
        </CardHeader>
        {/* Verificação de saúde do backend */}
        {isChecking && (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Verificando conectividade com o servidor...
            </AlertDescription>
          </Alert>
        )}

        {!isChecking && !isHealthy && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Não foi possível conectar com o servidor. Verifique se o backend está rodando em http://localhost:8080
              {error && (
                <div className="mt-2 text-sm">
                  Erro: {error}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isHealthy && <SigninForm/>}
      </Card>
      <ModeToggle className="absolute top-4 right-4"/>
      <FlickeringParticles className="absolute inset-0 invert dark:invert-0 dark:opacity-10 opacity-20"/>
    </div>
  );
}