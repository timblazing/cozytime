import { SearchBar } from './SearchBar';
import { AddVideoDialog } from './AddVideoDialog';
import { useState, useEffect } from 'react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refetchVideos: () => void;
}

// Rate limiting constants
const MAX_VIDEOS_PER_DAY = 15;
const RATE_LIMIT_STORAGE_KEY = 'videoUploadHistory';

export function Navbar({ searchQuery, setSearchQuery, refetchVideos }: NavbarProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [canAddVideo, setCanAddVideo] = useState(true);

  // Check if user has reached the upload limit
  useEffect(() => {
    const checkUploadLimit = () => {
      // Get upload history from localStorage
      const uploadHistoryJson = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
      const uploadHistory = uploadHistoryJson ? JSON.parse(uploadHistoryJson) : [];
      
      // Filter for uploads in the last 24 hours
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const recentUploads = uploadHistory.filter((timestamp: number) => timestamp > oneDayAgo);
      
      // Update state based on whether user can add more videos
      setCanAddVideo(recentUploads.length < MAX_VIDEOS_PER_DAY);
    };

    // Check initially and whenever localStorage might change
    checkUploadLimit();
    window.addEventListener('storage', checkUploadLimit);
    
    return () => {
      window.removeEventListener('storage', checkUploadLimit);
    };
  }, []);

  // Function to track new video uploads
  const handleVideoAdded = () => {
    const uploadHistoryJson = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    const uploadHistory = uploadHistoryJson ? JSON.parse(uploadHistoryJson) : [];
    
    // Add current timestamp to history
    uploadHistory.push(Date.now());
    
    // Save updated history
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(uploadHistory));
    
    // Recheck limit
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentUploads = uploadHistory.filter((timestamp: number) => timestamp > oneDayAgo);
    setCanAddVideo(recentUploads.length < MAX_VIDEOS_PER_DAY);
    
    // Refetch videos
    refetchVideos();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-50">
      <div className="container mx-auto px-4 md:px-4">
        <div className="flex items-center justify-between h-20 md:h-14">
          <a 
            href="/cozytime/" 
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
              refetchVideos={handleVideoAdded} 
              className={`md:opacity-100 ${isSearchExpanded ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}
              disabled={!canAddVideo}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
