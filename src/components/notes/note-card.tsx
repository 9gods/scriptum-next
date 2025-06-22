'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { PinIcon, TagsIcon, EditIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { cleanMarkdownText, formatBrazilianDate } from '@/lib/note-utils';
import { NoteCardProps } from '@/domain/types/types';

const NoteTags = ({ tags }: { tags: string[] }) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex items-start gap-2 text-sm">
      <TagsIcon className="h-4 w-4 mt-1 flex-shrink-0 text-muted-foreground" />
      <div className="flex flex-wrap gap-1">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="bg-secondary px-2 py-1 rounded-md text-xs truncate max-w-[100px]"
            title={tag}
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="text-xs text-muted-foreground self-center">
            +{tags.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

const NoteCardHeader = ({ 
  title, 
  isPinned, 
  createdAt, 
  onTogglePin 
}: {
  title: string;
  isPinned: boolean;
  createdAt?: string;
  onTogglePin: () => void;
}) => (
  <CardHeader className="pb-2 space-y-1">
    <div className="flex justify-between items-start gap-2">
      <CardTitle className="text-lg line-clamp-2 leading-tight">
        {title || 'Sem título'}
      </CardTitle>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          onTogglePin();
        }}
        className="h-8 w-8 p-0"
        aria-label={isPinned ? 'Desfixar nota' : 'Fixar nota'}
      >
        <PinIcon
          className={`h-4 w-4 ${
            isPinned ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
          }`}
        />
      </Button>
    </div>
    {createdAt && (
      <p className="text-xs text-muted-foreground">{formatBrazilianDate(createdAt)}</p>
    )}
  </CardHeader>
);

const NoteCardFooter = ({ 
  noteId,
  onDelete 
}: {
  noteId: string;
  onDelete: () => void;
}) => (
  <CardFooter className="flex justify-end gap-2 p-4 pt-0">
    <Button variant="outline" size="sm" asChild className="gap-1">
      <Link href={`/notes/${noteId}/edit`} aria-label="Editar nota">
        <EditIcon className="h-3.5 w-3.5" />
        Editar
      </Link>
    </Button>
    <Button
      variant="destructive"
      size="sm"
      onClick={onDelete}
      className="gap-1"
      aria-label="Excluir nota"
    >
      <TrashIcon className="h-3.5 w-3.5" />
      Excluir
    </Button>
  </CardFooter>
);

export const NoteCard = ({ note, onTogglePin, onDeleteNote }: NoteCardProps) => {
  const cardStyle = {
    backgroundColor: note.color || 'hsl(var(--background))',
    borderColor: note.color ? `${note.color}50` : 'hsl(var(--border))',
  };

  return (
    <Card
      className="flex flex-col h-full transition-all hover:shadow-lg min-w-[250px]"
      style={cardStyle}
    >
      <NoteCardHeader
        title={note.title}
        isPinned={note.isPinned}
        createdAt={note.createdAt}
        onTogglePin={() => onTogglePin(note.id)}
      />

      <CardContent className="flex-grow space-y-3">
        <p className="line-clamp-4 text-sm text-muted-foreground">
          {cleanMarkdownText(note.content)}
        </p>
        <NoteTags tags={note.tags} />
      </CardContent>

      <NoteCardFooter 
        noteId={note.id}
        onDelete={() => onDeleteNote(note.id)}
      />
    </Card>
  );
};