import {Tag} from "@/domain/entities/tag";

export interface Note {
    color: string;
    id: string;
    title: string;
    content: string; // markdown
    tags: Array<Tag>;
    isPinned: boolean;
    userId: string;
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

