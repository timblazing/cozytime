import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import type { Video } from '../types/video';

export function useVideos(searchQuery: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const records = await pb.collection('videos').getList(1, 50, {
          sort: '-created',
        });
        setVideos(records.items.map(item => ({
          id: item.id,
          title: item.title,
          video_url: item.video_url,
          created: item.created,
          tags: item.tags || []
        })));
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
      setLoading(false);
    }

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    if (searchQuery === '') return true;
    
    const query = searchQuery.toLowerCase();
    return video.title.toLowerCase().includes(query) || 
           video.tags.some(tag => tag.toLowerCase().includes(query));
  });

  return { videos: filteredVideos, loading };
}
