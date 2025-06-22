import type { Note } from "@/domain/entities/note";

/**
 * Remove formatação Markdown do texto
 * @param text - Texto com formatação Markdown
 * @returns Texto limpo sem formatação Markdown
 */
export const cleanMarkdownText = (text: string): string => {
	const markdownSymbols = /[#*`_\[\]!]/g;
	const listItems = /^-\s+/gm;

	return text.replace(markdownSymbols, "").replace(listItems, "").slice(0, 200);
};

// instancia unica do formatter para evitar ficar criando a cada chamada
const brazDateFormatter = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "short",
	year: "numeric",
});

/**
 * formata data para o padrão brasileiro
 * @param input - Data a ser formatada. Pode ser `Date`, timestamp (`number`) ou `string` compativel.
 * @returns data formatada
 * @throws {Error} auando a data e invalida ou nao pode ser interpretada.
 */
export function formatBrazilianDate(input: Date | number | string): string {
	const date = input instanceof Date ? input : new Date(input);
	if (Number.isNaN(date.getTime())) {
		throw new Error(`Invalid Date: ${input}`);
	}

	return brazDateFormatter.format(date);
}

/**
 * Ordena notas por fixadas e depois por data (mais recente primeiro)
 * @param notes - Array de notas a serem ordenadas
 * @returns Array de notas ordenadas
 */
export const sortNotes = (notes: Array<Note>): Array<Note> =>
	notes
		.slice() // cópia
		.sort(
			(a, b) =>
				+b.isPinned - +a.isPinned ||
				b.createdAt.getTime() - a.createdAt.getTime(),
		);
