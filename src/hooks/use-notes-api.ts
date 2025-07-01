import { useState, useEffect, useCallback } from 'react';
import { Note } from '@/domain/entities/note';
import { apiService } from '@/domain/service/api';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { toast } from 'sonner';

export function useNotesApi() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  // Carregar todas as notas
  const loadNotes = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setNotes([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedNotes = await apiService.getNotes(user.id);
      setNotes(fetchedNotes);
    } catch (err: any) {
      console.error('Erro ao carregar notas:', err);
      setError(err.response?.data?.message || 'Erro ao carregar notas');
      toast.error('Erro ao carregar notas');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Criar nova nota
  const createNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'modifiedAt' | 'userId'>) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const newNote = await apiService.createNote({
        ...noteData,
        userId: user.id,
        id: '', // Será gerado pelo backend
        createdAt: new Date(),
        modifiedAt: new Date(),
      });
      
      setNotes(prev => [...prev, newNote]);
      toast.success('Nota criada com sucesso!');
      return newNote;
    } catch (err: any) {
      console.error('Erro ao criar nota:', err);
      setError(err.response?.data?.message || 'Erro ao criar nota');
      toast.error('Erro ao criar nota');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Atualizar nota
  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedNote = await apiService.updateNote(id, {
        ...updates,
        modifiedAt: new Date(),
      } as Note);
      
      setNotes(prev => prev.map(note => 
        note.id === id ? updatedNote : note
      ));
      toast.success('Nota atualizada com sucesso!');
      return updatedNote;
    } catch (err: any) {
      console.error('Erro ao atualizar nota:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar nota');
      toast.error('Erro ao atualizar nota');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Deletar nota
  const deleteNote = useCallback(async (id: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiService.deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success('Nota excluída com sucesso!');
    } catch (err: any) {
      console.error('Erro ao deletar nota:', err);
      setError(err.response?.data?.message || 'Erro ao deletar nota');
      toast.error('Erro ao deletar nota');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Buscar nota por ID
  const getNoteById = useCallback(async (id: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const note = await apiService.getNoteById(id);
      return note;
    } catch (err: any) {
      console.error('Erro ao buscar nota:', err);
      setError(err.response?.data?.message || 'Erro ao buscar nota');
      toast.error('Erro ao buscar nota');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Buscar notas por tag
  const getNotesByTag = useCallback(async (tagId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const taggedNotes = await apiService.getNotesByTag(user.id, tagId);
      return taggedNotes;
    } catch (err: any) {
      console.error('Erro ao buscar notas por tag:', err);
      setError(err.response?.data?.message || 'Erro ao buscar notas por tag');
      toast.error('Erro ao buscar notas por tag');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Buscar notas por título
  const searchNotesByTitle = useCallback(async (title: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await apiService.searchNotesByTitle(user.id, title);
      return searchResults;
    } catch (err: any) {
      console.error('Erro ao buscar notas por título:', err);
      setError(err.response?.data?.message || 'Erro ao buscar notas por título');
      toast.error('Erro ao buscar notas por título');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Buscar notas por conteúdo
  const searchNotesByContent = useCallback(async (content: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await apiService.searchNotesByContent(user.id, content);
      return searchResults;
    } catch (err: any) {
      console.error('Erro ao buscar notas por conteúdo:', err);
      setError(err.response?.data?.message || 'Erro ao buscar notas por conteúdo');
      toast.error('Erro ao buscar notas por conteúdo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Carregar notas quando o usuário mudar
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    isLoading,
    error,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNotesByTag,
    searchNotesByTitle,
    searchNotesByContent,
  };
} 