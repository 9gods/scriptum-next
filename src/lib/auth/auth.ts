// Em /lib/auth/auth.ts (exemplo de como deveria ser)
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {apiService} from "@/domain/service/api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Chame sua API de backend aqui
          const authResponse = await apiService.login({
            email: credentials.email,
            password: credentials.password,
          });

          // Se a autenticação for bem-sucedida, retorne os dados do usuário
          // que serão codificados no JWT da sessão
          if (authResponse && authResponse.token) {
            return {
              id: authResponse.userId,
              name: authResponse.name,
              email: authResponse.email,
              accessToken: authResponse.token,
            };
          }
          // Retorna null se a autenticação falhar
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          // Retorna null para indicar falha de login
          return null;
        }
      },
    }),
  ],
  
  // Callbacks para gerenciar o token e a sessão
  callbacks: {
    async jwt({token, user}) {
      // O 'user' só está disponível no primeiro login
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({session, token}) {
      // Adiciona o accessToken e o ID do usuário ao objeto da sessão
      if (token) {
        session.accessToken = token.accessToken as string;
        if (session.user) {
          session.user.id = token.id as string;
        }
      }
      return session;
    },
  },
  
  // Defina as páginas de autenticação
  pages: {
    signIn: "/auth/signin",
  },
  
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};