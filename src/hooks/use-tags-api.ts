import { useState, useEffect, useCallback } from 'react';
import { Tag } from '@/domain/entities/tag';
import { apiService } from '@/domain/service/api';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { toast } from 'sonner';

export function useTagsApi() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  // Carregar todas as tags
  const loadTags = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setTags([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedTags = await apiService.getAllTags(user.id);
      setTags(fetchedTags);
    } catch (err: any) {
      console.error('Erro ao carregar tags:', err);
      setError(err.response?.data?.message || 'Erro ao carregar tags');
      toast.error('Erro ao carregar tags');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Criar nova tag
  const createTag = useCallback(async (tagData: Omit<Tag, 'id' | 'createdAt' | 'modifiedAt'>) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const newTag = await apiService.createTag({
        ...tagData,
        id: '', // Será gerado pelo backend
        createdAt: new Date(),
        modifiedAt: new Date(),
      });
      
      setTags(prev => [...prev, newTag]);
      toast.success('Tag criada com sucesso!');
      return newTag;
    } catch (err: any) {
      console.error('Erro ao criar tag:', err);
      setError(err.response?.data?.message || 'Erro ao criar tag');
      toast.error('Erro ao criar tag');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Atualizar tag
  const updateTag = useCallback(async (id: string, updates: Partial<Tag>) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedTag = await apiService.updateTag(id, {
        ...updates,
        modifiedAt: new Date(),
      } as Tag);
      
      setTags(prev => prev.map(tag => 
        tag.id === id ? updatedTag : tag
      ));
      toast.success('Tag atualizada com sucesso!');
      return updatedTag;
    } catch (err: any) {
      console.error('Erro ao atualizar tag:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar tag');
      toast.error('Erro ao atualizar tag');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Deletar tag
  const deleteTag = useCallback(async (id: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiService.deleteTag(id);
      setTags(prev => prev.filter(tag => tag.id !== id));
      toast.success('Tag excluída com sucesso!');
    } catch (err: any) {
      console.error('Erro ao deletar tag:', err);
      setError(err.response?.data?.message || 'Erro ao deletar tag');
      toast.error('Erro ao deletar tag');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Buscar tag por ID
  const getTagById = useCallback(async (id: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tag = await apiService.getTagById(id);
      return tag;
    } catch (err: any) {
      console.error('Erro ao buscar tag:', err);
      setError(err.response?.data?.message || 'Erro ao buscar tag');
      toast.error('Erro ao buscar tag');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Buscar tags por nome
  const searchTagsByName = useCallback(async (name: string) => {
    if (!isAuthenticated || !user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await apiService.searchTagsByName(user.id, name);
      return searchResults;
    } catch (err: any) {
      console.error('Erro ao buscar tags por nome:', err);
      setError(err.response?.data?.message || 'Erro ao buscar tags por nome');
      toast.error('Erro ao buscar tags por nome');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Carregar tags quando o usuário mudar
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    tags,
    isLoading,
    error,
    loadTags,
    createTag,
    updateTag,
    deleteTag,
    getTagById,
    searchTagsByName,
  };
} 