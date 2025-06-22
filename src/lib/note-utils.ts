import { NoteCardProps } from "@/domain/types/types";

/**

 * @param text - formatação Markdown
  @returns 

export const cleanMarkdownText = (text: string): string => {
  const markdownSymbols = /[#*`_\[\]!]/g;
  const listItems = /^\- /gm;
  
  return text
    .replace(markdownSymbols, '')
    .replace(listItems, '')
    .substring(0, 200);
};

/**
 * formata data para o padrão brasileiro
 * @param dateString - data em formato string
 * @returns data formatada 
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
 * ordena notas por fixadas e depois por data
 * @param notes - array de notas
 * @returns array de notas ordenadas
 */
export const sortNotes = (notes: NoteCardProps['note'][]) => {
  return [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};