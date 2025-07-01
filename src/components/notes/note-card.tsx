import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { getContrastTextColor } from '@/lib/utils'

interface NoteCardProps {
  id: string
  title: string
  content: string
  tags: string[]
  links: string[]
  lastEdited?: string
  color?: string
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
  color = '#ffffff',
  className = '',
  onEdit,
  onDelete
}: NoteCardProps) {
  const textColor = getContrastTextColor(color);
  const isLightText = textColor === 'light';

  return (
    <div className={`relative w-full max-w-md group ${className}`}>
      <div 
        className="rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full shadow-md hover:shadow-lg transition-shadow"
        style={{ backgroundColor: color }}
      >
        <h3 className={`text-lg font-semibold mb-2 ${
          isLightText ? 'text-white' : 'text-gray-800 dark:text-gray-100'
        }`}>
          {title}
        </h3>
        <p className={`text-sm mb-4 line-clamp-3 ${
          isLightText ? 'text-gray-200' : 'text-gray-600 dark:text-gray-300'
        }`}>
          {content}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span 
                key={`${id}-${tag}`}
                className={`px-2 py-1 text-xs rounded-full ${
                  isLightText 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {lastEdited && (
          <p className={`text-xs mt-4 ${
            isLightText ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
          }`}>
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