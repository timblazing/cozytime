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
        if (isMobile) setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    if (isExpanded && inputRef.current && isMobile) {
      inputRef.current.focus();
    }
  }, [isExpanded, isMobile]);

  // Desktop version
  if (!isMobile) {
    return (
      <div className="w-full max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:ring-0"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>
      </div>
    );
  }

  // Mobile version
  return (
    <div ref={containerRef} className="relative flex items-center h-9">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-0 z-10 h-9 w-9 flex items-center justify-center"
      >
        <Search className={`h-5 w-5 transition-colors duration-200 ${isExpanded ? 'text-zinc-400' : 'text-white'}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-out ${
          isExpanded ? 'w-52' : 'w-9'
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full h-9 pl-9 pr-4 text-sm text-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-0 transition-all duration-200 ease-out ${
            isExpanded 
              ? 'opacity-100 bg-zinc-800 border border-zinc-700 rounded-full focus:border-zinc-700' 
              : 'opacity-0 bg-transparent border-transparent'
          }`}
        />
      </div>
    </div>
  );
}
