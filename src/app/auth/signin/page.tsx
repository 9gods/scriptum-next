import {FlickeringParticles} from "@/components/animations/flickering-particles";
import {SigninForm} from "@/components/auth/signin-form";
import {ModeToggle} from "@/components/mode-toggle";
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
          <CardTitle>Entrar no Scriptum</CardTitle>
          <CardDescription>
            Insira seu email e senha, ou acesse sua conta Google.
          </CardDescription>
        </CardHeader>
        <SigninForm/>
      </Card>
      <ModeToggle className="absolute top-4 right-4"/>
      <FlickeringParticles className="absolute inset-0 invert dark:invert-0 dark:opacity-10 opacity-20"/>
    </div>
  );
}