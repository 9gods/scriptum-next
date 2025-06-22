import type { Note } from "@/domain/entities/note";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as immer from "immer";

type NoteStore = {
	notes: Note[];
	addNote: (note: Omit<Note, "id" | "createdAt">) => void;
	getNote: (id: string) => Note | undefined;
	updateNote: (id: string, updates: Partial<Note>) => void;
	deleteNote: (id: string) => void;
	togglePin: (id: string) => void;
};

export const useNoteStore = create<NoteStore>()(
	persist<NoteStore>(
		(set, get) => ({
			notes: [],

			addNote: (note) =>
				set(
					immer.produce((state: NoteStore) => {
						state.notes.push({
							...note,
							id: crypto.randomUUID(),
							createdAt: new Date(),
						});
					}),
				),

			getNote: (id) => get().notes.find((n) => n.id === id),

			updateNote: (id, updates) =>
				set(
					immer.produce((state: NoteStore) => {
						const target = state.notes.find((n) => n.id === id);
						if (target) Object.assign(target, updates);
					}),
				),

			deleteNote: (id) =>
				set(
					immer.produce((state: NoteStore) => {
						state.notes = state.notes.filter((n) => n.id !== id);
					}),
				),

			togglePin: (id) =>
				set(
					immer.produce((state: NoteStore) => {
						const target = state.notes.find((n) => n.id === id);
						if (target) target.isPinned = !target.isPinned;
					}),
				),
		}),
		{
			name: "notes-storage",
			version: 1,

			migrate: (persistedState: unknown, version: number): NoteStore => {
				if (!persistedState || version < 1) {
					return {
						notes: [],
						addNote: () => {},
						getNote: () => undefined,
						updateNote: () => {},
						deleteNote: () => {},
						togglePin: () => {},
					};
				}

				const state = persistedState as NoteStore;
				return {
					...state,
					notes: state.notes.map((n) => ({
						...n,
						createdAt: new Date(n.createdAt),
					})),
				};
			},
		},
	),
);
