import { z } from "zod";

export const noteSchema = z.object({
	title: z.string().min(2, { message: "Mínimo 2 caracteres" }),
	content: z.string().min(10, { message: "Mínimo 10 caracteres" }),
	tags: z.string().array(),
	color: z.string().default("#ffffff"),
	isPinned: z.boolean().default(false),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
