import { FileText, Star, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction
} from "@/components/ui/card"

interface NoteCardProps {
  title: string
  content: string
  lastEdited: string
  tags?: string[]
  isFavorite?: boolean
  className?: string
}

export function NoteCard({
  title,
  content,
  lastEdited,
  tags = [],
  isFavorite = false,
  className
}: NoteCardProps) {

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            <CardDescription>{lastEdited}</CardDescription>
          </div>
        </div>
        
        <CardAction>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {content}
        </p>
      </CardContent>

      {(tags.length > 0 || isFavorite) && (
        <CardFooter className="gap-2">
          {isFavorite && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          )}
          {tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-accent rounded-md"
            >
              #{tag}
            </span>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}