import { FileText, Star, MoreVertical, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NoteCardProps } from "@/domain/entities/note";


export function NoteCard({
  title,
  content,
  lastEdited,
  tags = [],
  isFavorite = false,
  isPinned = false,
  color = "bg-background",
  className,
  onClick,
}: NoteCardProps) {
  
  const plainContent = content.replace(/[#*_~`\|\[\]]/, "");

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow overflow-hidden",
        color !== "bg-background" && "border-none",
        className
      )}
      onClick={onClick}
      style={{ backgroundColor: color !== "bg-background" ? color : undefined }}
    >
      <div className="relative">
        {(isPinned || isFavorite) && (
          <div className="absolute top-2 right-2 flex gap-1">
            {isPinned && (
              <Pin className="h-4 w-4 text-muted-foreground rotate-45" />
            )}
            {isFavorite && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <CardTitle className="line-clamp-1 text-ellipsis">
                {title || "Nota sem título"}
              </CardTitle>
              <CardDescription className="text-xs">
                Editado {lastEdited}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-2">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {plainContent || "Nenhum conteúdo..."}
          </p>
        </CardContent>

        {(tags.length > 0) && (
          <CardFooter className="flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-normal"
              >
                #{tag}
              </Badge>
            ))}
          </CardFooter>
        )}
      </div>
    </Card>
  );
}