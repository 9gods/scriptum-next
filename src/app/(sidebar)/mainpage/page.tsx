"use client"
import { NoteCard } from '@/components/notes/note-card'
import { ModeToggle } from "@/components/mode-toggle"
import { NotesList } from '@/components/notes/notes-list'
import { SearchNotes } from '@/components/notes/search-notes'
import { useNotesApi } from '@/hooks/use-notes-api'
import { useAuthGuard } from '@/hooks/use-auth-guard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Note } from '@/domain/entities/note'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const TEMPLATES_NOTES_TITLE = "Talvez você se interesse..."
const NOTES_TITLE = "Minhas Notas"

export default function HomePage() {
  const { isAuthenticated, isChecking } = useAuthGuard();
  const { notes, isLoading, error, deleteNote, updateNote, loadNotes } = useNotesApi();
  const router = useRouter();

  const [displayedNotes, setDisplayedNotes] = useState<Note[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')

  useEffect(() => {
    if (notes.length > 0) {
      setDisplayedNotes(notes);
    }
  }, [notes]);

  const handleSearchResults = useCallback((searchResults: Note[]) => {
    setDisplayedNotes(searchResults);
    setIsSearching(true);
  }, []);

  const handleClearSearch = useCallback(() => {
    setDisplayedNotes(notes);
    setIsSearching(false);
  }, [notes]);

  const handleDeleteNote = useCallback(async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete.id);
        setIsDeleteModalOpen(false)
        setNoteToDelete(null)
        // Recarregar notas após deletar
        await loadNotes();
      } catch (error) {
        console.error('Erro ao deletar nota:', error);
      }
    }
  }, [noteToDelete, deleteNote, loadNotes])

  const handleSaveEdit = useCallback(async () => {
    if (noteToEdit) {
      try {
        await updateNote(noteToEdit.id, {
          title: editedTitle,
          content: editedContent,
        });
        setIsEditModalOpen(false)
        setNoteToEdit(null)
        // Recarregar notas após editar
        await loadNotes();
      } catch (error) {
        console.error('Erro ao atualizar nota:', error);
      }
    }
  }, [noteToEdit, editedTitle, editedContent, updateNote, loadNotes])

  // Aguardar verificação de autenticação
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

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Erro ao carregar notas: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <ModeToggle className="absolute top-4 right-4 z-10" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <section className="py-8 px-4 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {isSearching ? "Resultados da Busca" : TEMPLATES_NOTES_TITLE}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {displayedNotes.length} {displayedNotes.length === 1 ? 'nota encontrada' : 'notas encontradas'}
              </p>
            </div>

            {/* Componente de busca */}
            <SearchNotes 
              onSearchResults={handleSearchResults}
              onClearSearch={handleClearSearch}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {displayedNotes.slice(0, 6).map((note) => (
                <NoteCard
                  key={note.id}
                  id={note.id || ''}
                  title={note.title || 'Sem título'}
                  content={note.content || ''}
                  tags={note.tags?.map(tag => tag.name) || []}
                  links={[]}
                  lastEdited={note.modifiedAt ? new Date(note.modifiedAt).toISOString() : undefined}
                  onEdit={() => {
                    setNoteToEdit(note)
                    setEditedTitle(note.title || '')
                    setEditedContent(note.content || '')
                    setIsEditModalOpen(true)
                  }}
                  onDelete={() => {
                    setNoteToDelete(note)
                    setIsDeleteModalOpen(true)
                  }}
                />
              ))}
            </div>
          </section>
          
          <NotesSection />
        </main>
      </div>

      {/* Modais */}
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        noteToDelete={noteToDelete}
        onConfirm={handleDeleteNote}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

// Componentes de modal separados para melhor organização
function DeleteModal({ isOpen, onOpenChange, noteToDelete, onConfirm }: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  noteToDelete: Note | null
  onConfirm: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
            Confirmar exclusão
          </DialogTitle>
          <DialogDescription className="pt-4 text-center text-gray-600 dark:text-gray-300">
            Você está prestes a excluir a nota <br />
            <span className="font-semibold text-gray-800 dark:text-gray-100">"{noteToDelete?.title}"</span>.
            <br /><br />
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex justify-center gap-4 pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="px-6">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            className="px-6"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditModal({ isOpen, onOpenChange, editedTitle, setEditedTitle, editedContent, setEditedContent, onSave }: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editedTitle: string
  setEditedTitle: (title: string) => void
  editedContent: string
  setEditedContent: (content: string) => void
  onSave: () => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
            Editar Nota
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título
            </label>
            <Input
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Conteúdo
            </label>
            <Textarea
              id="content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[200px]"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-center gap-4 pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="px-6">
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            onClick={onSave}
            className="px-6"
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function NotesSection() {
  return (
    <section className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{NOTES_TITLE}</h1>
      </div>
      <NotesList />
    </section>
  )
}