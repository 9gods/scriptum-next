// app/notes/[id]/page.tsx
import { NoteForm } from '@/components/auth/note-form';

export default function EditNotePage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Nota</h1>
      <NoteForm noteId={id} />
    </div>
  );
}