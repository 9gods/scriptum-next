"use client";

import {Button} from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {Input} from "../ui/input";
import {useForm} from "react-hook-form";
import {
  type LoginFormValues,
  loginSchema,
} from "@/schemas/user-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useState} from "react";
import {CardContent, CardFooter} from "../ui/card";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/lib/store/use-auth-store";

export const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: LoginFormValues) {
    console.log("onSubmit chamado!");
    console.log("Valores do formulário:", values);
    setIsLoading(true);
    
    try {
      // Usar o método login do store de autenticação
      await login({
        email: values.email,
        password: values.password,
      });
      
      toast.success("Login realizado com sucesso!");
      router.push("/mainpage");
      router.refresh();
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      if (error.response && error.response.status === 401) {
        toast.error("Credenciais inválidas.");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Adicionar log para verificar erros de validação
  const formErrors = form.formState.errors;
  console.log("Erros do formulário:", formErrors);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          console.log("Form submit event disparado!");
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4 max-w-md"
        noValidate
      >
        <CardContent>
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem className="mt-4">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="nome@exemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem className="mt-4">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <div className="mt-4 flex items-center gap-0 text-sm">
              Novo por aqui?
              <Link href={"/auth/signup"}>
                <Button type="button" variant={"link"} className="pl-1">Registre-se</Button>
              </Link>
            </div>
          </div>

        </CardContent>
        <CardFooter className="justify-end">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Entrando…" : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};