'use client';

import { useNoteStore } from '@/lib/store/note-store';
import { NoteCard } from './note-card';
import { EmptyState } from './empty-state';
import { sortNotes } from '@/lib/note-utils';

export const NotesList = () => {
  const { notes, deleteNote, togglePin } = useNoteStore();

  const handleDeleteNote = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      deleteNote(id);
    }
  };

  if (notes.length === 0) {
    return <EmptyState />;
  }

  const responsiveGridClasses = 'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full';

  return (
    <div className={responsiveGridClasses}>
      {sortNotes(notes).map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onTogglePin={togglePin}
          onDelete={handleDeleteNote}
        />
      ))}
    </div>
  );
};