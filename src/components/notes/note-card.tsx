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
import { useNoteStore } from "@/lib/store/note-store";
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
import { useState } from "react";

export type NoteCardProps = {
  note: Note;
  onDelete?: (noteId: string) => void;
};

export const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const { deleteNote } = useNoteStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const cardStyle = {
    backgroundColor: note.color || "hsl(var(--background))",
    borderColor: note.color ? `${note.color}50` : "hsl(var(--border))",
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNote(note.id);
      
      if (onDelete) {
        onDelete(note.id);
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card
        className="flex flex-col h-full transition-all hover:shadow-lg min-w-[250px]"
        style={cardStyle}
      >
        <CardHeader className="pb-2 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg line-clamp-2 leading-tight">
              {note.title || "Sem título"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="h-8 w-8 p-0"
              aria-label={note.isPinned ? "Desfixar nota" : "Fixar nota"}
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
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary px-2 py-1 rounded-md text-xs truncate max-w-[100px]"
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-4 pt-0">
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link href={`/notes/${note.id}/edit`} aria-label="Editar nota">
              <EditIcon className="h-3.5 w-3.5" />
              Editar
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
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
              onClick={handleDelete}
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