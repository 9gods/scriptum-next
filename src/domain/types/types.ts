import { icons } from "lucide-react";

export interface Note {
  id: string;
  title: string;
  content: string; // markdown
  tags: string[];
  color: string;
  isPinned: boolean;
  createdAt: Date;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  icon?: keyof typeof icons;
  className?: string;
}


export type FormValues = {
  title: string;
  content: string;
  tags: string[];
  color: string;
  isPinned: boolean;
};

export type NoteCardProps = {
  note: Note;
  onTogglePin: (id: string) => void;
  onDeleteNote: (id: string) => void;
};
