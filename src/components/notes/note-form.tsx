"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type NoteFormValues, noteSchema } from "@/schemas/notes-schema";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownPreview } from "@/components/ui/markdown-preview";


export function NoteForm() {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);




  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      isPinned: false,
color: "#FFFF",
 tags: ["asd"]   
 },
  });

  const content = form.watch("content");

  // Efeito para contar palavras e caracteres
  useEffect(() => {
    const text = content || "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setCharCount(text.length);
  }, [content]);

  const onSubmit = (values: NoteFormValues) => {
    console.log("Nota salva:", values);
    // Lógica para salvar a nota
  };

  // Atalhos de teclado para formatação Markdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    // Ctrl+B para negrito
    if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
      form.setValue("content", newText);
      textarea.selectionStart = start + 2;
      textarea.selectionEnd = end + 2;
    }

    // Ctrl+I para itálico
    if (e.ctrlKey && e.key === "i") {
      e.preventDefault();
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + `_${selectedText}_` + value.substring(end);
      form.setValue("content", newText);
      textarea.selectionStart = start + 1;
      textarea.selectionEnd = end + 1;
    }
  };

  return (
    <div className={`flex flex-col h-full  inset-0 bg-red-400  z-50 bg-background p-4`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Título da nota"
                      className="text-2xl font-bold border-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-muted-foreground">
                      Fixar
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button type="submit" size="sm">
                Salvar
              </Button>
            </div>
          </div>

          <Tabs
           defaultValue="write"
            className="flex-1 bg-red-500 flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="write">Editar</TabsTrigger>
                <TabsTrigger value="preview">Visualizar</TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">
                {wordCount} palavras • {charCount} caracteres
              </div>
            </div>

            <TabsContent value="write" className="min-w-full">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="h-full">
                    <FormControl>
                      <Textarea
                        {...field}
                        onKeyDown={handleKeyDown}
                        placeholder="Comece a escrever aqui... Use Markdown para formatação."
                        className="h-full w-full p-4 font-mono text-sm resize-none border-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="preview" className="min-w-full">
              <div className="h-full p-4 overflow-auto prose dark:prose-invert max-w-none">
                <MarkdownPreview
                  content={content || "*Nada para pré-visualizar*"}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  const content = form.getValues("content") || "";
                  form.setValue("content", content + "\n# ");
                }}
                className="hover:text-foreground"
                title="Cabeçalho 1 (Ctrl+1)"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => {
                  const content = form.getValues("content") || "";
                  form.setValue("content", content + "\n## ");
                }}
                className="hover:text-foreground"
                title="Cabeçalho 2 (Ctrl+2)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => {
                  const content = form.getValues("content") || "";
                  form.setValue("content", content + "\n- ");
                }}
                className="hover:text-foreground"
                title="Lista (Ctrl+L)"
              >
                Lista
              </button>
              <button
                type="button"
                onClick={() => {
                  const content = form.getValues("content") || "";
                  form.setValue("content", content + "\n```\n\n```");
                }}
                className="hover:text-foreground"
                title="Bloco de código (Ctrl+K)"
              >
                Código
              </button>
            </div>
            <div>Markdown</div>
          </div>
        </form>
      </Form>
    </div>
  );
}

function addNote(values: { title: string; content: string; tags: any[]; color: string; isPinned: boolean; }) {
	throw new Error("Function not implemented.");
}
