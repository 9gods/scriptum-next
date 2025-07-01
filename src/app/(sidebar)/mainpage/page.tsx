"use client"
import {NoteCard} from '@/components/main-page/note-card'
import {ModeToggle} from "@/components/mode-toggle"
import {NotesList} from '@/components/notes/notes-list'
import {useState, useCallback} from 'react'
import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import {FiTrash2, FiEdit} from 'react-icons/fi'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  links: string[];
  lastEdited?: string;
}

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
    {
      id: '2',
      title: 'Ideias para Aplicativo',
      content: 'Roadmap de desenvolvimento para a versão 1.0...',
      tags: ['desenvolvimento'],
      links: ['roadmap'],
      lastEdited: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Dicas de Estudo',
      content: 'Como melhorar seu foco e retenção de conhecimento...',
      tags: ['educação', 'aprendizado'],
      links: ['tecnicas-estudo'],
      lastEdited: new Date().toISOString()
    }
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

  const openDeleteModal = useCallback((note: Note) => {
    setNoteToDelete(note)
    setIsDeleteModalOpen(true)
  }, [])

  const openEditModal = useCallback((note: Note) => {
    setNoteToEdit(note)
    setEditedTitle(note.title)
    setEditedContent(note.content)
    setIsEditModalOpen(true)
  }, [])

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
      <ModeToggle className="absolute top-4 right-4 z-10"/>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {/* Template Notes Section */}
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
                <div
                  key={note.id}
                  className="relative w-full max-w-md group"
                >
                  <NoteCard
                    note={''} {...note}
                    className="h-full shadow-md hover:shadow-lg transition-shadow"/>
                  <div className="absolute top-0 right-0 flex gap-1">
                    <button
                      onClick={() => openEditModal(note)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 shadow-md z-20"
                      aria-label={`Editar nota ${note.title}`}
                    >
                      <FiEdit className="h-4 w-4"/>
                    </button>
                    <button
                      onClick={() => openDeleteModal(note)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md z-20"
                      aria-label={`Deletar nota ${note.title}`}
                    >
                      <FiTrash2 className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* User Notes Section */}
          <NotesSection/>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription className="pt-4 text-center text-gray-600 dark:text-gray-300">
              Você está prestes a excluir a nota <br/>
              <span className="font-semibold text-gray-800 dark:text-gray-100">"{noteToDelete?.title}"</span>.
              <br/><br/>
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
              onClick={handleDeleteNote}
              className="px-6"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
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
              onClick={handleSaveEdit}
              className="px-6"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function NotesSection() {
  return (
    <section className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{NOTES_TITLE}</h1>
      </div>
      <NotesList/>
    </section>
  )
}