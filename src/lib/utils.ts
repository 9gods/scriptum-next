import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calcula o contraste de uma cor e retorna se deve usar texto claro ou escuro
 * @param backgroundColor - Cor de fundo em formato hex (#RRGGBB)
 * @returns 'light' para texto claro ou 'dark' para texto escuro
 */
export function getContrastTextColor(backgroundColor: string): 'light' | 'dark' {
  // Remove o # se presente
  const hex = backgroundColor.replace('#', '');
  
  // Converte hex para RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calcula a luminância relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Retorna 'dark' para fundos claros e 'light' para fundos escuros
  return luminance > 0.5 ? 'dark' : 'light';
}

/**
 * Calcula a luminância de uma cor
 * @param backgroundColor - Cor de fundo em formato hex (#RRGGBB)
 * @returns Valor de luminância entre 0 e 1
 */
export function getLuminance(backgroundColor: string): number {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
