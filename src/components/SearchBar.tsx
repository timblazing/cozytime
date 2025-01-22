import { Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isMobile && !searchQuery) setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, searchQuery]);

  useEffect(() => {
    if (searchQuery) setIsExpanded(true);
  }, [searchQuery]);

  useEffect(() => {
    if (isExpanded && inputRef.current && isMobile) {
      inputRef.current.focus();
    }
  }, [isExpanded, isMobile]);

  if (!isMobile) {
    return (
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-4 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:ring-0"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex items-center">
      {isExpanded ? (
        <div className="relative w-60 animate-in fade-in slide-in-from-right duration-200">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-4 pr-9 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:ring-0"
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-center h-9 w-9"
        >
          <Search className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
}
