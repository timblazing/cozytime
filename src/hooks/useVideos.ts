import { useState } from 'react';
import type { Video } from '../types/video';
import { videos } from '../data/videos';

export function useVideos(searchQuery: string) {
  const [videoList, setVideoList] = useState<Video[]>(videos);

  const filteredVideos = videoList.filter(video => {
    if (searchQuery === '') return true;
    
    const query = searchQuery.toLowerCase();
    return video.title.toLowerCase().includes(query) || 
           video.tags.some(tag => tag.toLowerCase().includes(query));
  });

  const refetchVideos = () => {
    setVideoList([...videos]); // Create a new array reference to trigger re-render
  };

  return { videos: filteredVideos, loading: false, refetchVideos };
}
