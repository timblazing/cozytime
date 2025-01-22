import { SearchBar } from './SearchBar';
import { AddVideoDialog } from './AddVideoDialog';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refetchVideos: () => void;
}

export function Navbar({ searchQuery, setSearchQuery, refetchVideos }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-50">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-14">
          <a href="/" className="flex items-center whitespace-nowrap">
            <span className="text-2xl">🏕️</span>
            <span className="ml-2 text-xl font-semibold">Cozytime</span>
          </a>
          <div className="hidden md:block flex-1 max-w-2xl mx-6">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <AddVideoDialog refetchVideos={refetchVideos} />
          </div>
        </div>
      </div>
    </header>
  );
}
