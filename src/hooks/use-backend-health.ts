"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/domain/service/api";

export function useBackendHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setIsChecking(true);
        setError(null);
        
        const response = await apiService.healthCheck();
        console.log("Backend health check:", response);
        setIsHealthy(true);
      } catch (err: any) {
        console.error("Backend health check failed:", err);
        setError(err.message || "Erro ao conectar com o backend");
        setIsHealthy(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkHealth();
  }, []);

  return { isHealthy, isChecking, error };
} 