import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ClipboardList, FilePlus2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyStateProps } from '@/domain/types/types';

const icons = {
  note: ClipboardList,
  create: FilePlus2,
};

export function EmptyState({
  title = 'Nenhuma nota encontrada',
  description = 'Comece criando sua primeira nota',
  actionText = 'Criar Nota',
  actionHref = "/notes/new",
  icon = 'note',
  className = '',
}: EmptyStateProps) {
  const IconComponent = icons[icon];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4 p-8 text-center rounded-lg border border-dashed',
      'bg-muted/50 text-muted-foreground',
      className
    )}>
      <div className="flex flex-col items-center justify-center gap-3">
        <IconComponent className="w-12 h-12 opacity-50" />
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          <p className="text-sm max-w-md">{description}</p>
        </div>
      </div>
      
      {actionText && actionHref && (
        <Button asChild className="mt-4">
          <Link href={actionHref} className="gap-2">
            <FilePlus2 className="h-4 w-4" />
            {actionText}
          </Link>
        </Button>
      )}
    </div>
  );

}
