import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

interface NoteCardProps {
  id: string
  title: string
  content: string
  tags: string[]
  links: string[]
  lastEdited?: string
  className?: string
  onEdit: () => void
  onDelete: () => void
}

export function NoteCard({
  id,
  title,
  content,
  tags,
  links,
  lastEdited,
  className = '',
  onEdit,
  onDelete
}: NoteCardProps) {
  return (
    <div className={`relative w-full max-w-md group ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{content}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span 
                key={`${id}-${tag}`}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {lastEdited && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Editado em: {new Date(lastEdited).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 shadow-md z-20 h-8 w-8"
          aria-label={`Editar nota ${title}`}
        >
          <FiEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md z-20 h-8 w-8"
          aria-label={`Deletar nota ${title}`}
        >
          <FiTrash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}