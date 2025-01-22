import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExpandChange?: (expanded: boolean) => void;
}

export function SearchBar({ searchQuery, setSearchQuery, onExpandChange }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleCollapse = useCallback(() => {
    if (isMobile) {
      setIsExpanded(false);
      onExpandChange?.(false);
      setSearchQuery('');
    }
  }, [isMobile, onExpandChange, setSearchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isMobile && !searchQuery) {
          handleCollapse();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, searchQuery, handleCollapse]);

  useEffect(() => {
    if (searchQuery && isMobile) {
      setIsExpanded(true);
      onExpandChange?.(true);
    }
  }, [searchQuery, onExpandChange, isMobile]);

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
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-2.5 text-sm text-zinc-400" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex items-center">
      {isExpanded ? (
        <div className="flex items-center w-full px-4 h-20 animate-in fade-in slide-in-from-right duration-200">
          <button
            onClick={handleCollapse}
            className="flex items-center justify-center h-12 w-12 mr-3"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-lg text-white" />
          </button>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-5 pr-11 bg-zinc-800 border border-zinc-700 rounded-full text-base text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-zinc-700 focus:ring-0"
            />
            <div className="absolute right-4 inset-y-0 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg text-zinc-400" />
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsExpanded(true);
            onExpandChange?.(true);
          }}
          className="flex items-center justify-center h-12 w-12"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg text-white" />
        </button>
      )}
    </div>
  );
}
