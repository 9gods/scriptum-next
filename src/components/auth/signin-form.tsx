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
import { useState, useEffect } from "react"; // Adicionado useEffect
import { CardContent, CardFooter } from "../ui/card";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useRouter } from "next/navigation";
import { apiService } from "@/domain/service/api";
import { signIn } from "next-auth/react";

export const SigninForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<UserFormValuesWithPassword>({
        resolver: zodResolver(userSchemaWithPassword),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    // Adicionado para debug
    useEffect(() => {
        const subscription = form.watch((value) => {
            console.log('Valores do formulário alterados:', value);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    async function onSubmit(values: UserFormValuesWithPassword) {
        console.log('Submit iniciado - valores:', {
            email: values.email,
            password: '[PROTECTED]' 
        });

        // Verificação extra da validação
        const isValid = await form.trigger();
        console.log('Validação do formulário:', isValid);
        console.log('Erros:', form.formState.errors);
        
        if (!isValid) {
            console.error('Formulário inválido - submit abortado');
            return;
        }

        setIsLoading(true);
        
        try {
            
            // Opção 1: Usando apiService (descomente para usar)
            console.log('Chamando apiService.login...');
            const user = await apiService.login({
                email: values.email,
                password: values.password
            });
            console.log('Resposta da API:', user);
            useAuthStore.getState().login(user);

            // Opção 2: Usando NextAuth (comente a opção 1 para usar)
            // console.log('Chamando signIn...');
            // const result = await signIn("credentials", {
            //     redirect: false,
            //     email: values.email,
            //     password: values.password,
            // });
            // console.log('Resultado do signIn:', result);
            // if (result?.error) throw new Error(result.error);
            // useAuthStore.getState().login(result);

            toast.success("Login realizado com sucesso!");
            router.push("/mainpage");
        } catch (error) {
            console.error('Erro no processo de login:', error);
            toast.error("Falha no login. Verifique suas credenciais.");
        } finally {
            setIsLoading(false);
            console.log('Processo de login finalizado');
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log('Erros no submit:', errors);
                })}
                className="space-y-4 max-w-md"
                noValidate // Para testar apenas a validação do react-hook-form
            >
                <CardContent>
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
                                        onChange={(e) => {
            
                                            field.onChange(e);
                                        }}
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
                                        autoComplete="current-password"
                                        placeholder="Digite sua senha"
                                        {...field}
                                        onChange={(e) => {
                                  
                                            field.onChange(e);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
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
                        onClick={() => console.log('Botão clicado - estado atual:', form.getValues())}
                    >
                        {isLoading ? "Entrando…" : "Entrar"}
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
};