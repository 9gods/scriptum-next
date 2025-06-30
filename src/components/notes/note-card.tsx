"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PinIcon, TagsIcon, EditIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { cleanMarkdownText, formatBrazilianDate } from "@/lib/note-utils";
import type { Note } from "@/domain/entities/note";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Feedback = {
  message: string;
  type: 'success' | 'error';
};

type NoteCardProps = {
  note: Note;
  onDelete?: (noteId: string) => void;
  onTogglePin?: (noteId: string) => void;
};

export const NoteCard = ({ note, onDelete, onTogglePin }: NoteCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const router = useRouter();

  const cardStyle = {
    backgroundColor: note.color || "hsl(var(--background))",
    borderColor: note.color ? `${note.color}50` : "hsl(var(--border))",
  };

  const showFeedback = (message: string, type: Feedback['type']) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleApiAction = async (
    url: string,
    method: string,
    successMessage: string,
    callback?: () => void,
    body?: any
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) throw new Error("Operação falhou");

      showFeedback(successMessage, 'success');
      callback?.();
    } catch (error) {
      showFeedback(
        error instanceof Error ? error.message : "Ocorreu um erro",
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => handleApiAction(
    `/api/notes/${note.id}`,
    "DELETE",
    "Nota excluída com sucesso!",
    () => {
      setIsDeleteDialogOpen(false);
      onDelete?.(note.id);
    }
  );

  const handleTogglePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    handleApiAction(
      `/api/notes/${note.id}/pin`,
      "PATCH",
      note.isPinned ? "Nota desfixada!" : "Nota fixada!",
      () => onTogglePin?.(note.id),
      { isPinned: !note.isPinned }
    );
  };

  return (
    <>
      {feedback && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md shadow-lg ${
          feedback.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {feedback.message}
        </div>
      )}
      
      <Card
        className="flex flex-col h-full transition-all hover:shadow-lg min-w-[250px] hover:scale-[1.02] cursor-pointer"
        style={cardStyle}
        onClick={() => router.push(`/notes/${note.id}`)}
      >
        <CardHeader className="pb-2 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-2 leading-tight">
              {note.title || "Sem título"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTogglePin}
              className="h-8 w-8 p-0"
              aria-label={note.isPinned ? "Desfixar nota" : "Fixar nota"}
              disabled={isLoading}
            >
              <PinIcon
                className={`h-4 w-4 ${
                  note.isPinned
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
          </div>
          {note.createdAt && (
            <p className="text-xs text-muted-foreground">
              {formatBrazilianDate(note.createdAt)}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="flex-grow space-y-3">
          <p className="line-clamp-4 text-sm text-muted-foreground">
            {cleanMarkdownText(note.content)}
          </p>
          <div className="flex items-start gap-2 text-sm">
            <TagsIcon className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {note.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary px-2 py-1 rounded-md text-xs truncate max-w-[100px]"
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {note.tags?.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 p-4 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/notes/${note.id}/edit`} aria-label="Editar nota">
              <EditIcon className="h-3.5 w-3.5" />
              Editar
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="gap-1"
            aria-label="Excluir nota"
            disabled={isLoading}
          >
            <TrashIcon className="h-3.5 w-3.5" />
            {isLoading ? "Processando..." : "Excluir"}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Processando..." : "Confirmar Exclusão"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};