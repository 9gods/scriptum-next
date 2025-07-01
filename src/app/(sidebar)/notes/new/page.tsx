"use client";

import { useRouter } from 'next/navigation';
import { NoteForm } from '@/components/notes/note-form';

export default function NewNotePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/');
    router.refresh(); 
  };

  return (
    <NoteForm 
      onSuccess={handleSuccess}
    />
  );
}