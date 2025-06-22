import { NoteCardProps } from "@/domain/types/types";

/**
 * Remove formatação Markdown do texto
 * @param text - Texto com formatação Markdown
 * @returns Texto limpo sem formatação Markdown
 */
export const cleanMarkdownText = (text: string): string => {
  const markdownSymbols = /[#*`_\[\]!]/g;
  const listItems = /^\- /gm;
  
  return text
    .replace(markdownSymbols, '')
    .replace(listItems, '')
    .substring(0, 200);
};

/**
 * Formata data para o padrão brasileiro
 * @param dateString - Data em formato string
 * @returns Data formatada no padrão brasileiro
 */
export const formatBrazilianDate = (dateString: string): string => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  
  return new Date(dateString).toLocaleDateString('pt-BR', dateOptions);
};

/**
 * Ordena notas por fixadas e depois por data (mais recente primeiro)
 * @param notes - Array de notas a serem ordenadas
 * @returns Array de notas ordenadas
 */
export const sortNotes = (notes: NoteCardProps['note'][]) => {
  return [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};