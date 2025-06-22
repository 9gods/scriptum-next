import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  content: z.string().min(10, { message: "Mínimo 10 caracteres" }),
  tags: z.array(z.string().min(1)),
  color: z.string().default('#ffffff'),
  isPinned: z.boolean().default(false),
});