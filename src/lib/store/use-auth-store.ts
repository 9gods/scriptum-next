import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {User} from '@/domain/entities/user';
import {apiService, AuthRequestBody, AuthResponse, UserRequestBody} from "@/domain/service/api";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

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
          console.log("AuthStore - Iniciando login:", credentials.email);
          set({isLoading: true});

          const response = await apiService.login(credentials);
          console.log('AuthStore - Response do login:', response);

          const user: User = {
            id: response.userId,
            name: response.name,
            email: response.email,
            password: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            newUser: response.newUser,
          };

          console.log("AuthStore - Definindo estado autenticado:", { user, token: response.token });
          set({
            user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log("AuthStore - Estado após login:", get());

        } catch (error) {
          console.error("AuthStore - Erro no login:", error);
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
        console.log("AuthStore - Fazendo logout");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User, token: string) => {
        console.log("AuthStore - Definindo usuário:", user);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        console.log("AuthStore - Limpando autenticação");
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
      partialize: (state) => {
        console.log("AuthStore - Salvando estado:", state);
        return {
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        };
      },
      skipHydration: true, // Pular hidratação automática
    }
  )
);