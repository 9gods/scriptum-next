import { Note } from "@/domain/entities/note";

// cleanMarkdownText melhorado
export const cleanMarkdownText = (text: string): string => {
  if (typeof text !== "string") {
    return ""; // Retorna vazio se não for string
  }
  const markdownSymbols = /[#*`_~`\|\[\]!]/g;
  return text.replace(markdownSymbols, "").slice(0, 200);
};

// formatBrazilianDate mais robusta
export function formatBrazilianDate(input: Date | number | string): string {
  const date = new Date(typeof input === "string" ? input + "T00:00:00" : input);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Formato de data inválido: "${input}". Use Date, timestamp ou string ISO.`);
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// sortNotes mais legível
export const sortNotes = (notes: Array<Note>): Array<Note> => {
  return [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return Number(b.isPinned) - Number(a.isPinned);
    }
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
};