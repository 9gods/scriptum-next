export interface Note {
	id: string;
	title: string;
	content: string; // markdown
	tags: Array<string>;
	color: string;
	isPinned: boolean;
	createdAt: Date;
}
