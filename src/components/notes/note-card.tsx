"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { PinIcon, TagsIcon, EditIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { cleanMarkdownText, formatBrazilianDate } from "@/lib/note-utils";
import type { Note } from "@/domain/entities/note";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type NoteCardProps = {
  note: Note;
  onDelete?: (noteId: string) => void;
  onTogglePin?: (noteId: string) => void;
};

export const NoteCard = ({ note, onDelete, onTogglePin }: NoteCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingPin, setIsTogglingPin] = useState(false);
  const [feedback, setFeedback] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const router = useRouter();

  const cardStyle = {
    backgroundColor: note.color || "hsl(var(--background))",
    borderColor: note.color ? `${note.color}50` : "hsl(var(--border))",
  };

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir nota");
      }

      setFeedback({
        message: "Nota excluída com sucesso!",
        type: 'success'
      });

      if (onDelete) {
        onDelete(note.id);
      }
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : "Ocorreu um erro ao excluir a nota",
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsTogglingPin(true);
      
      const response = await fetch(`/api/notes/${note.id}/pin`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar status de fixação");
      }

      setFeedback({
        message: note.isPinned ? "Nota desfixada!" : "Nota fixada!",
        type: 'success'
      });

      if (onTogglePin) {
        onTogglePin(note.id);
      }
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a nota",
        type: 'error'
      });
    } finally {
      setIsTogglingPin(false);
    }
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
              disabled={isTogglingPin}
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
              {note.tags && note.tags.length > 3 && (
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
            disabled={isDeleting}
          >
            <TrashIcon className="h-3.5 w-3.5" />
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta nota? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};