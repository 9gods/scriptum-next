"use client";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import {
  type UserFormValuesWithPassword,
  userSchemaWithPassword,
} from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { CardContent, CardFooter } from "../ui/card";
import Link from "next/link";

export const SignupForm = () => {
  const form = useForm<UserFormValuesWithPassword>({
    resolver: zodResolver(userSchemaWithPassword),
    defaultValues: {
      email: "",
      name: "",
      avatarUrl: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(values: UserFormValuesWithPassword) {
    // const submissionPayload = await signupService(values);
    // if (!submissionPayload.success) {
    //   toast.error("Opa! Algo deu errado...", {
    //     description: "Por favor, verifique os campos.",
    //   });
    // }
    toast.success("Conta criada com sucesso!");
    form.reset();
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
            name="name"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>URL do avatar (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Escolha uma senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <div className="mt-4 flex items-center gap-0 text-sm">
              Já possui conta?
              <Link href={"/auth/signin"}>
                <Button type="button" variant={"link"} className="pl-1">Faça Login</Button>
              </Link>
            </div>
          </div>


        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Enviando…" : "Criar conta"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};
