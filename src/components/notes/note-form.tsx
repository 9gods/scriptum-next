"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type NoteFormValues, noteSchema } from "@/schemas/notes-schema";
import { useNoteStore } from "@/lib/store/note-store";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MarkdownPreview } from "../ui/markdown-preview";
import { TagsInput } from "./tags-input";
import { ColorPicker } from "./colors-picker";

type NoteFormProps = {
	noteId?: string;
};

export function NoteForm({ noteId }: NoteFormProps) {
	const router = useRouter();
	const { addNote, updateNote, getNote } = useNoteStore();
	const isEditing = Boolean(noteId);

	const form = useForm<NoteFormValues>({
		resolver: zodResolver(noteSchema),
		defaultValues:
			isEditing && noteId
				? getNote(noteId)
				: {
						title: "",
						content: "",
						tags: [],
						color: "#ffffff",
						isPinned: false,
					},
	});

	const onSubmit = (values: NoteFormValues) => {
		if (isEditing && noteId) {
			updateNote(noteId, values);
		} else {
			addNote(values);
		}
		router.push("/");
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Título</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Seu Título aqui.." />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Conteúdo</FormLabel>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
								<div className="h-full border rounded-md overflow-hidden">
									<FormControl>
										<Textarea
											{...field}
											placeholder="Escreva aqui...."
											className="h-full w-full p-4 font-mono resize-none"
										/>
									</FormControl>
								</div>
								<div className="h-full border rounded-md overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
									<MarkdownPreview
										content={field.value || "*Pré-visualização..*"}
									/>
								</div>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tags</FormLabel>
							<FormControl>
								<TagsInput selected={field.value} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="isPinned"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel>Fixar nota</FormLabel>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="color"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cor de fundo</FormLabel>
							<FormControl>
								<ColorPicker
									value={field.value || "#ffffff"}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full">
					{isEditing ? "Atualizar Nota" : "Criar Nota"}
				</Button>
			</form>
		</Form>
	);
}
