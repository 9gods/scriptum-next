import {Tag} from "@/domain/entities/tag";

export interface Note {
    id: string;
    title: string;
    content: string; // markdown
    tags: Array<Tag>;
    isPinned: boolean;
    createdAt: Date;
    modifiedAt: Date;
}
