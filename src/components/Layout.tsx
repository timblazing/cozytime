import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  showNavbar: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refetchVideos: () => void;
}

export function Layout({ children, showNavbar, searchQuery, setSearchQuery, refetchVideos }: LayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {showNavbar && <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetchVideos={refetchVideos} />}
      <main className={`${showNavbar ? 'pt-24 md:pt-20' : ''}`}>
        {children}
      </main>
    </div>
  );
}
