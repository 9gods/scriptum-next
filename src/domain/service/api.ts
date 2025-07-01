import axios from "axios";
import {Note} from "@/domain/entities/note";
import {User} from "@/domain/entities/user";
import {Tag} from "@/domain/entities/tag";

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(
  (config) => {
    try {
      const { useAuthStore } = require('@/lib/store/use-auth-store');
      const token = useAuthStore.getState().token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }
    } catch (error) {
      console.log('Zustand store não disponível, tentando localStorage');
    }

    // Fallback para localStorage (compatibilidade)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const {state} = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error connecting to server: ', error);
    }

    if (error.response?.status === 401) {
      console.log('Erro 401 - Limpando autenticação');
      
      // Limpar Zustand store
      try {
        const { useAuthStore } = require('@/lib/store/use-auth-store');
        useAuthStore.getState().clearAuth();
      } catch (error) {
        console.log('Erro ao limpar Zustand store:', error);
      }
      
      // Limpar localStorage também
      localStorage.removeItem('auth-storage');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }

    return Promise.reject(error);
  }
);

export interface AuthResponse {
  userId: string;
  name: string;
  email: string;
  token: string;
  emailVerified: boolean;
  newUser: boolean;
}

export interface UserRequestBody {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export interface AuthRequestBody {
  email: string;
  password: string;
}

export const apiService = {
  login: async (credentials: AuthRequestBody): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: UserRequestBody): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<Record<string, any>> => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  resendVerification: async (userId: string): Promise<Record<string, any>> => {
    const response = await api.post(`/auth/resend-verification?userId=${userId}`);
    return response.data;
  },

  healthCheck: async (): Promise<string> => {
    const response = await api.get('/auth/health');
    return response.data;
  },

  // =============== USER ENDPOINTS ===============

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: User): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // =============== NOTE ENDPOINTS ===============

  getNotes: async (userId: string): Promise<Note[]> => {
    const response = await api.get(`/notes?userId=${userId}`);
    return response.data;
  },

  createNote: async (noteData: Note): Promise<Note> => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  getNoteById: async (id: string): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  updateNote: async (id: string, noteData: Note): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  getNotesByTag: async (userId: string, tagId: string): Promise<Note[]> => {
    const response = await api.get(`/notes/tag/${tagId}?userId=${userId}`);
    return response.data;
  },

  searchNotesByTitle: async (userId: string, title: string): Promise<Note[]> => {
    const response = await api.get(`/notes/search/title?userId=${userId}&title=${encodeURIComponent(title)}`);
    return response.data;
  },

  searchNotesByContent: async (userId: string, content: string): Promise<Note[]> => {
    const response = await api.get(`/notes/search/content?userId=${userId}&content=${encodeURIComponent(content)}`);
    return response.data;
  },

  // =============== TAG ENDPOINTS ===============

  getAllTags: async (userId: string): Promise<Tag[]> => {
    const response = await api.get(`/tags?userId=${userId}`);
    return response.data;
  },

  createTag: async (tagData: Tag): Promise<Tag> => {
    const response = await api.post('/tags', tagData);
    return response.data;
  },

  getTagById: async (id: string): Promise<Tag> => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  updateTag: async (id: string, tagData: Tag): Promise<Tag> => {
    const response = await api.put(`/tags/${id}`, tagData);
    return response.data;
  },

  deleteTag: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },

  searchTagsByName: async (userId: string, name: string): Promise<Tag[]> => {
    const response = await api.get(`/tags/search?userId=${userId}&name=${encodeURIComponent(name)}`);
    return response.data;
  }
};
