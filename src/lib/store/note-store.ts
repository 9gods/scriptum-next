import { create } from 'zustand';
import { Note } from '@/domain/types/types';
import { persist } from 'zustand/middleware';
type NoteStore = {
  notes: Note[];
  // CREATE
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  // READ
  getNote: (id: string) => Note | undefined;
  // UPDATE
  updateNote: (id: string, updates: Partial<Note>) => void;
  // DELETE
  deleteNote: (id: string) => void;
  // TOGGLE PIN
  togglePin: (id: string) => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      notes: [],
      // CREATE
      addNote: (note) => set((state) => ({
        notes: [
          ...state.notes,
          {
            ...note,
            id: crypto.randomUUID(),
            createdAt: new Date(),
          },
        ],
      })),
      // READ
      getNote: (id) => get().notes.find((note) => note.id === id),
      // UPDATE
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, ...updates } : note
        ),
      })),
      // DELETE
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      })),
      // TOGGLE PIN
      togglePin: (id) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, isPinned: !note.isPinned } : note
        ),
      })),
    }),
    {
      name: 'notes-storage', // localStorage
    }
  )
);