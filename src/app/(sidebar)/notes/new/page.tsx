"use client"

import { NoteForm } from '@/components/auth/note-form';

export default function NewNotePage() {
// implementar a sidebar aqui

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Criando...</h1>
      <NoteForm />
    </div>
  );
}