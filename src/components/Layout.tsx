import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refetchVideos: () => void;
}

export function Layout({ children, searchQuery, setSearchQuery, refetchVideos }: LayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetchVideos={refetchVideos} />
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}
