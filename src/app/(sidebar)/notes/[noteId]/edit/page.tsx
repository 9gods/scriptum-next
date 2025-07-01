"use client";

import { useRouter } from 'next/navigation';
import { NoteForm } from '@/components/notes/note-form';
import { useNote } from '@/hooks/use-note';
import { Loader2 } from 'lucide-react';

export default function NoteEditPage({ params }: { params: { noteId: string } }) {
  const router = useRouter();
  const { note, isLoading } = useNote(params.noteId);

  const handleSuccess = () => {
    router.push('/');
    router.refresh(); 
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <NoteForm 
      initialData={note} 
      onSuccess={handleSuccess}
      onDelete={() => router.push('/')}
    />
  );
}