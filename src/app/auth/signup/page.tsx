import { FlickeringParticles } from "@/components/animations/flickering-particles";
import { SignupForm } from "@/components/auth/signup-form";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <Card className="z-10 min-w-sm">
        <CardHeader>
          <CardTitle>Criar conta no Scriptum</CardTitle>
          <CardDescription>
            Insira os dados abaixo para criar sua conta.
          </CardDescription>
        </CardHeader>
        <SignupForm />
      </Card>
      <ModeToggle className="absolute top-4 right-4" />
      <FlickeringParticles className="absolute inset-0 invert dark:invert-0 dark:opacity-10 opacity-20" />
    </div>
  );
}
