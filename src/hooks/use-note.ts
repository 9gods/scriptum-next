import { useState, useEffect } from 'react';
import { Note } from '@/domain/entities/note';
import { useNotesApi } from './use-notes-api';

export function useNote(noteId?: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getNoteById } = useNotesApi();

  useEffect(() => {
    if (!noteId) {
      setIsLoading(false);
      return;
    }

    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const fetchedNote = await getNoteById(noteId);
        setNote(fetchedNote);
      } catch (error) {
        console.error('Error fetching note:', error);
        setNote(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId, getNoteById]);

  return { note, isLoading };
}