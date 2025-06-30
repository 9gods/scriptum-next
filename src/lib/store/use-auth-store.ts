import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {User} from '@/domain/entities/user';
import {apiService, AuthRequestBody, UserRequestBody} from "@/domain/service/api";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: AuthRequestBody) => Promise<void>;
  register: (userData: UserRequestBody) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: AuthRequestBody) => {
        try {
          set({isLoading: true});

          const response = await apiService.login(credentials);

          const user: User = {
            id: response.userId,
            name: response.name,
            email: response.email,
            password: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            newUser: response.newUser,
          };

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

        } catch (error) {
          set({isLoading: false});
          throw error;
        }
      },

      register: async (userData: UserRequestBody) => {
        try {
          set({isLoading: true});

          const response = await apiService.register(userData);

          const user: User = {
            id: response.userId,
            name: response.name,
            email: response.email,
            password: '', // Não armazenar senha
            avatarUrl: userData.avatarUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
            newUser: response.newUser,
          };

          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

        } catch (error) {
          set({isLoading: false});
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);