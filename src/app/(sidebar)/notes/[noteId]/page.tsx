"use client";

import { useNote } from '@/hooks/use-note';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Button } from '@/components/ui/button';
import { MarkdownPreview } from '@/components/ui/markdown-preview';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getContrastTextColor } from '@/lib/utils';

export default function NotePage({ params }: { params: { noteId: string } }) {
  const { isAuthenticated, isChecking } = useAuthGuard();
  const { note, isLoading } = useNote(params.noteId);
  const router = useRouter();

  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Nota não encontrada</h1>
        <p className="text-muted-foreground mb-4">
          A nota que você está procurando não existe ou foi removida.
        </p>
        <Button onClick={() => router.push('/mainpage')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o início
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/mainpage')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <Button
            onClick={() => router.push(`/notes/${note.id}/edit`)}
            className="mb-4"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>

        {/* Note Content */}
        <div 
          className="bg-card border rounded-lg p-8 shadow-sm"
          style={{ backgroundColor: note.color || '#ffffff' }}
        >
          {/* Title */}
          <h1 className={`text-3xl font-bold mb-4 ${
            getContrastTextColor(note.color || '#ffffff') === 'light' 
              ? 'text-white' 
              : 'text-foreground'
          }`}>
            {note.title}
          </h1>

          {/* Metadata */}
          <div className={`flex items-center gap-4 mb-6 text-sm ${
            getContrastTextColor(note.color || '#ffffff') === 'light' 
              ? 'text-gray-200' 
              : 'text-muted-foreground'
          }`}>
            <div>
              Criado em: {formatDate(note.createdAt)}
            </div>
            <div>
              Modificado em: {formatDate(note.modifiedAt)}
            </div>
            {note.isPinned && (
              <Badge variant="secondary">Fixada</Badge>
            )}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {note.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Content */}
          <div className={`prose max-w-none ${
            getContrastTextColor(note.color || '#ffffff') === 'light' 
              ? 'prose-invert' 
              : ''
          }`}>
            <MarkdownPreview content={note.content} />
          </div>
        </div>
      </div>
    </div>
  );
} 