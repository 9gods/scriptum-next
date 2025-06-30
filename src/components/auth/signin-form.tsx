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
  type UserFormValuesWithPassword,
  userSchemaWithPassword,
} from "@/schemas/user-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useState} from "react";
import {CardContent, CardFooter} from "../ui/card";
import Link from "next/link";
import {useAuthStore} from "@/lib/store/use-auth-store";
import {useRouter} from "next/navigation";


export const SigninForm = () => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  const form = useForm<UserFormValuesWithPassword>({
    resolver: zodResolver(userSchemaWithPassword),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: UserFormValuesWithPassword) {
    try {
      await login({
        email: values.email,
        password: values.password
      });

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Falha no login", {
        description: "Verifique seu e-mail e senha e tente novamente."
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
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
                    autoComplete="new-password"
                    placeholder="Digite sua senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            name="google-signin"
            render={() => (
              <FormItem className="mt-4">
                <FormLabel className="flex justify-center"></FormLabel>
                <FormControl>
                  <div className="space-y-4">

                    <div className="w-full border-t border-white"></div>
                  </div>
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
          <Button type="submit">
            {isLoading ? "Entrando…" : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
