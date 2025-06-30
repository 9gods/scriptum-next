'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

export function TagsInput({ 
  selected, 
  onChange 
}: { 
  selected: string[]; 
  onChange: (tags: string[]) => void 
}) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const isValidTag = (tag: string) => {
    return tag.trim().length > 0 && 
           tag.length <= 20 && 
           /^[a-zA-Z0-9á-úÁ-Ú ]+$/.test(tag);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      const newTag = input.trim();
      
      if (!isValidTag(newTag)) {
        setError('Tags devem ter até 20 caracteres alfanuméricos');
        return;
      }
      
      if (!selected.includes(newTag)) {
        onChange([...selected, newTag]);
        setInput('');
        setError('');
      } else {
        setError('Tag já adicionada');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(selected.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError('');
        }}
        onKeyDown={handleKeyDown}
        placeholder="Digite tags e pressione Enter..."
        aria-label="Adicionar tags"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((tag) => (
          <span 
            key={tag} 
            className="bg-secondary px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={() => removeTag(tag)}
            title="Clique para remover"
          >
            {tag} ×
          </span>
        ))}
      </div>
    </div>
  );
}