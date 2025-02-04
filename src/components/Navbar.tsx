import { SearchBar } from './SearchBar';
import { AddVideoDialog } from './AddVideoDialog';
import { useState } from 'react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refetchVideos: () => void;
}

export function Navbar({ searchQuery, setSearchQuery, refetchVideos }: NavbarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-50">
      <div className="container mx-auto px-4 md:px-4">
        <div className="flex items-center justify-between h-20 md:h-14">
          <a 
            href="/" 
            className={`flex items-center whitespace-nowrap transition-opacity duration-200 ${
              isSearchExpanded ? 'md:opacity-100 opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            <span className="text-3xl md:text-2xl">🏕️</span>
            <span className="ml-3 text-2xl md:text-xl font-semibold">Cozytime</span>
          </a>
          <div className="hidden md:block flex-1 max-w-2xl mx-6">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div className="flex items-center gap-3 md:gap-2">
            <div className={`md:hidden ${isSearchExpanded ? 'absolute inset-0 bg-zinc-900' : ''}`}>
              <SearchBar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
                onExpandChange={setIsSearchExpanded}
              />
            </div>
            <AddVideoDialog 
              refetchVideos={refetchVideos} 
              className={`md:opacity-100 ${isSearchExpanded ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
