'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

export function TagsInput({ selected, onChange }: { selected: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (['Enter', 'Tab', ','].includes(e.key)) {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !selected.includes(newTag)) {
        onChange([...selected, newTag]);
        setInput('');
      }
    }
  };

  return (
    <div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Digite tags..."
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((tag) => (
          <span key={tag} className="bg-secondary px-2 py-1 rounded-md text-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}