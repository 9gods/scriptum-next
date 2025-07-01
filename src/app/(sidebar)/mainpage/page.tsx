"use client"
import { NoteCard } from '@/components/notes/note-card'
import { ModeToggle } from "@/components/mode-toggle"
import { NotesList } from '@/components/notes/notes-list'
import { useState, useCallback } from 'react'
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
import { Note } from '@/domain/types/types'



const TEMPLATES_NOTES_TITLE = "Talvez você se interesse..."
const NOTES_TITLE = "Minhas Notas"

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Sistemas de Notas Avançados',
      content: 'Técnicas eficientes para organização pessoal e profissional...',
      tags: ['produtividade', 'pesquisa'],
      links: ['metodos-eficientes'],
      lastEdited: new Date().toISOString()
    },
    // ... outros exemplos de notas
  ])

  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')

  const handleDeleteNote = useCallback(() => {
    if (noteToDelete) {
      setNotes(prevNotes => 
        prevNotes.filter(note => note.id !== noteToDelete.id)
      )
      setIsDeleteModalOpen(false)
      setNoteToDelete(null)
    }
  }, [noteToDelete])

  const handleSaveEdit = useCallback(() => {
    if (noteToEdit) {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteToEdit.id
            ? {
                ...note,
                title: editedTitle,
                content: editedContent,
                lastEdited: new Date().toISOString()
              }
            : note
        )
      )
      setIsEditModalOpen(false)
      setNoteToEdit(null)
    }
  }, [noteToEdit, editedTitle, editedContent])

  return (
    <div className="flex h-full">
      <ModeToggle className="absolute top-4 right-4 z-10" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <section className="py-8 px-4 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {TEMPLATES_NOTES_TITLE}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {notes.length} {notes.length === 1 ? 'sugestão disponível' : 'sugestões disponíveis'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  {...note}
                  className="w-full"
                  onEdit={() => {
                    setNoteToEdit(note)
                    setEditedTitle(note.title)
                    setEditedContent(note.content)
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

      {/* Modais (mantidos iguais) */}
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