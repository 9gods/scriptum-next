'use client';

import { useNotesApi } from '@/hooks/use-notes-api';
import { NoteCard } from './note-card';
import { EmptyState } from './empty-state';
import { sortNotes } from '@/lib/note-utils';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const NotesList = () => {
  const { isAuthenticated, isChecking } = useAuthGuard();
  const { notes, isLoading, error, deleteNote, updateNote } = useNotesApi();
  const router = useRouter();

  const handleDeleteNote = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        await deleteNote(id);
      } catch (error) {
        console.error('Erro ao deletar nota:', error);
      }
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const note = notes.find(n => n.id === id);
      if (note) {
        await updateNote(id, { isPinned: !note.isPinned });
      }
    } catch (error) {
      console.error('Erro ao fixar/desfixar nota:', error);
    }
  };

  // Aguardar verificação de autenticação
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Erro ao carregar notas: {error}
      </div>
    );
  }

  if (notes.length === 0) {
    return <EmptyState />;
  }

  const responsiveGridClasses = 'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full';

  return (
    <div className={responsiveGridClasses}>
      {sortNotes(notes).map((note) => (
        <NoteCard
          key={note.id}
          id={note.id || ''}
          title={note.title || 'Sem título'}
          content={note.content || ''}
          tags={note.tags?.map(tag => tag.name) || []}
          links={[]}
          color={note.color || '#ffffff'}
          lastEdited={note.modifiedAt ? new Date(note.modifiedAt).toISOString() : undefined}
          onEdit={() => router.push(`/notes/${note.id}/edit`)}
          onDelete={() => handleDeleteNote(note.id)}
        />
      ))}
    </div>
  );
};