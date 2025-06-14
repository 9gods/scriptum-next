import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório." })
    .email("Formato de e-mail inválido."),
  name: z
    .string({ required_error: "Nome é obrigatório." })
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(100, "Nome pode ter no máximo 100 caracteres."),
  avatarUrl: z.string().url("URL do avatar inválida.").optional(),
});

export const userSchemaWithPassword = userSchema.extend({
  password: z
    .string({ required_error: "Senha é obrigatória." })
    .min(8, "Senha deve ter pelo menos 8 caracteres.")
    .max(100, "Senha pode ter no máximo 100 caracteres.")
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Senha deve conter letras e números."),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type UserFormValuesWithPassword = z.infer<typeof userSchemaWithPassword>;
