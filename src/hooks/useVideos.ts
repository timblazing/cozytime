import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import { ClientResponseError } from 'pocketbase';
import type { Video } from '../types/video';

export function useVideos(searchQuery: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchVideos() {
    try {
      const records = await pb.collection('videos').getList(1, 50);
      setVideos(records.items.map(item => ({
        id: item.id,
        title: item.title,
        video_url: item.video_url,
        created: item.created,
        tags: item.tags || []
      })));
    } catch (error) {
      if (error instanceof ClientResponseError) {
        console.error('Error fetching videos:', error.message);
      } else if (error instanceof Error) {
        console.error('Error fetching videos:', error.message);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    if (searchQuery === '') return true;
    
    const query = searchQuery.toLowerCase();
    return video.title.toLowerCase().includes(query) || 
           video.tags.some(tag => tag.toLowerCase().includes(query));
  });

  const refetchVideos = () => {
    setLoading(true);
    fetchVideos();
  };

  return { videos: filteredVideos, loading, refetchVideos };
}
