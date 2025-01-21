import { SearchBar } from './SearchBar';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Navbar({ searchQuery, setSearchQuery }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-50">
      <div className="flex items-center h-14">
        <div className="flex-none pl-4 pr-6">
          <a href="/" className="flex items-center whitespace-nowrap">
            <span className="text-2xl">🏕️</span>
            <span className="ml-2 text-xl font-semibold">Cozytime</span>
          </a>
        </div>
        <div className="flex-1">
          <div className="flex justify-end w-full pr-6">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </div>
    </header>
  );
}
