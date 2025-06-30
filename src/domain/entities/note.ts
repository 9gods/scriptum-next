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

export interface NoteCardProps {
    note: string;
  title: string;
  content: string;
  lastEdited: string;
  tags?: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
  color?: string;
  className?: string;
  onClick?: () => void;
}