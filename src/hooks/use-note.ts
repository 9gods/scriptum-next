
import { useState, useEffect } from 'react';
import { Note } from '@/domain/entities/note';

export function useNote(noteId?: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!noteId) {
      setIsLoading(false);
      return;
    }

    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        const data = await response.json();
        setNote(data);
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  return { note, isLoading };
}