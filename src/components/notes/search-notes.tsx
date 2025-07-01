"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useNotesApi } from "@/hooks/use-notes-api";
import { Note } from "@/domain/entities/note";

interface SearchNotesProps {
  onSearchResults: (notes: Note[]) => void;
  onClearSearch: () => void;
}

export function SearchNotes({ onSearchResults, onClearSearch }: SearchNotesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { searchNotesByTitle, searchNotesByContent } = useNotesApi();

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      onClearSearch();
      return;
    }

    setIsSearching(true);
    try {
      // Buscar por título e conteúdo
      const [titleResults, contentResults] = await Promise.all([
        searchNotesByTitle(searchTerm),
        searchNotesByContent(searchTerm)
      ]);

      // Combinar resultados e remover duplicatas
      const allResults = [...titleResults, ...contentResults];
      const uniqueResults = allResults.filter((note, index, self) => 
        index === self.findIndex(n => n.id === note.id)
      );

      onSearchResults(uniqueResults);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, searchNotesByTitle, searchNotesByContent, onSearchResults, onClearSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    onClearSearch();
  }, [onClearSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar notas por título ou conteúdo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>
      <Button
        onClick={handleSearch}
        disabled={isSearching || !searchTerm.trim()}
        variant="outline"
      >
        {isSearching ? "Buscando..." : "Buscar"}
      </Button>
      {searchTerm && (
        <Button
          onClick={handleClear}
          variant="ghost"
          size="icon"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 