"use client"
import { NoteCard } from '@/components/main-page/note-card'
import { ModeToggle } from "@/components/mode-toggle"
import { NotesList } from '@/components/notes/notes-list'

const NOTES_TITLE = "Minhas Notas"
const TEMPLATES_NOTES_TITLE = "Talvez você se interesse.."

export default function HomePage() {
  
  const notes = [
    {
      title: 'Sistemas de Notas brabo',
      content: 'Algo bem foda por aqui...',
      tags: ['produtividade', 'pesquisa'],
      links: ['metodos-eficientes']
    },
    {
      title: 'Ideias para o Ap',
      content: 'Implementando v1 simples...',
      tags: ['desenvolvimento'],
      links: ['roadmap']
    }
  ]
  return (
    <div className="flex h-full">
      <ModeToggle className="absolute top-4 right-4" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-auto p-6 bg-background">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{TEMPLATES_NOTES_TITLE}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <NoteCard 
                  key={`${note.title}-${note.tags.join('-')}`} 
                  lastEdited={''} 
                  {...note} 
                />
              ))}
            </div>
          </section>
          
          <NotesSection />
        </main>
      </div>
    </div>
  )
}

function NotesSection() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{NOTES_TITLE}</h1>
      </div>
      <NotesList />
    </div>
  )
}