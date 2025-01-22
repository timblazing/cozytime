import { useState } from 'react';
import { VideoCard } from '../components/VideoCard';
import { WatchDialog } from '../components/WatchDialog';
import { AnimatedPage } from '../components/AnimatedPage';
import type { Video } from '../types/video';

export interface HomeProps {
  videos: Video[];
  loading: boolean;
  setSearchQuery: (query: string) => void;
}

export function Home({ videos, loading, setSearchQuery }: HomeProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isWatchDialogOpen, setIsWatchDialogOpen] = useState(false);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-2 md:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {videos.map((video, index) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            index={index} 
            setSearchQuery={setSearchQuery}
            onWatch={() => {
              setSelectedVideo(video);
              setIsWatchDialogOpen(true);
            }}
          />
          ))}
        </div>
      </div>
      <WatchDialog
        video={selectedVideo}
        isOpen={isWatchDialogOpen}
        setIsOpen={setIsWatchDialogOpen}
      />
    </AnimatedPage>
  );
}
