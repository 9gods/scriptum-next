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
import { useRouter } from "next/navigation";

interface NoteFormProps {
  initialData?: NoteFormValues & { id?: string };
  onSuccess?: () => void;
}

export function NoteForm({ initialData, onSuccess }: NoteFormProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const router = useRouter();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
      isPinned: false,
      color: "#FFFF",
      tags: []
    },
  });

  const content = form.watch("content");

  useEffect(() => {
    const text = content || "";
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setCharCount(text.length);
  }, [content]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const onSubmit = async (values: NoteFormValues) => {
    setIsSubmitting(true);
    try {
      let response;
      const noteData = {
        ...values,
        tags: values.tags || [],
      };

      if (initialData?.id) {
        response = await fetch(`/api/notes/${initialData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });
      } else {
        response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });
      }

      if (!response.ok) {
        throw new Error("Falha ao salvar a nota");
      }

      const result = await response.json();
      
      setFeedback({
        message: initialData?.id ? "Nota atualizada com sucesso!" : "Nota criada com sucesso!",
        type: 'success'
      });

      if (onSuccess) {
        onSuccess();
      } else if (!initialData?.id) {
        router.push(`/notes/${result.id}`);
      }
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : "Ocorreu um erro ao salvar a nota",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    if (e.ctrlKey && e.key === "b") {
      e.preventDefault();
      const selectedText = value.substring(start, end);
      const newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
      form.setValue("content", newText);
      textarea.selectionStart = start + 2;
      textarea.selectionEnd = end + 2;
    }

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
    <div className="fixed inset-0 bg-background overflow-auto">
      <div className="min-h-screen w-full flex flex-col items-center p-4">
        <div className="w-full max-w-6xl flex-1 flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
              {/* Feedback Message */}
              {feedback && (
                <div className={`mb-4 p-3 rounded-md text-center ${
                  feedback.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {feedback.message}
                </div>
              )}
              
              {/* Header */}
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
                          className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0"
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
                  <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>

              {/* Editor Area */}
              <Tabs defaultValue="write" className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <TabsList className="grid w-[200px] grid-cols-2">
                    <TabsTrigger value="write">Editar</TabsTrigger>
                    <TabsTrigger value="preview">Visualizar</TabsTrigger>
                  </TabsList>
                  <div className="text-sm text-muted-foreground">
                    {wordCount} palavras • {charCount} caracteres
                  </div>
                </div>

                <TabsContent value="write" className="flex-1 min-h-[400px]">
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
                            className="h-full w-full p-4 font-mono text-base resize-none border rounded-lg focus-visible:ring-1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="preview" className="flex-1 min-h-[400px]">
                  <div className="h-full p-4 overflow-auto prose dark:prose-invert max-w-none border rounded-lg">
                    <MarkdownPreview
                      content={content || "*Nada para pré-visualizar*"}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer */}
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
                </div>
                <div>Markdown</div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}