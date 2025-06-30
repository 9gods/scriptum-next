"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {useAuthStore} from "@/lib/store/use-auth-store";

export function useAuthGuard() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated, user };
}
