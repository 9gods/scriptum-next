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
import { useRouter } from "next/navigation";
import { apiService } from "@/domain/service/api";

export const SignupForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

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
        setIsLoading(true);
        try {
            // Chama a API de registro
            const user = await apiService.register({
                name: values.name,
                email: values.email,
                password: values.password,
                avatarUrl: values.avatarUrl || undefined // Envia como undefined se estiver vazio
            });

            toast.success("Conta criada com sucesso!", {
                description: "Verifique seu e-mail para confirmar sua conta."
            });

            // Redireciona para a página de verificação
            router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);

        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Falha no cadastro", {
                description: error instanceof Error
                    ? error.message
                    : "Verifique os campos e tente novamente."
            });
        } finally {
            setIsLoading(false);
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
                                    <Input
                                        placeholder="https://..."
                                        {...field}
                                        value={field.value || ""}
                                    />
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
                                        placeholder="Escolha uma senha segura"
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
                                <Button type="button" variant={"link"} className="pl-1">
                                    Faça Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Criando conta…" : "Criar conta"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
};