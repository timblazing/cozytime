import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import type { Video } from '../types/video';
import { getYouTubeVideoId } from '../utils/youtube';
import { AnimatedPage } from '../components/AnimatedPage';

interface WatchProps {
  setSearchQuery: (query: string) => void;
}

export function Watch({ setSearchQuery }: WatchProps) {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      if (!id) return;

      try {
        const record = await pb.collection('videos').getOne(id);
        setVideo({
          id: record.id,
          title: record.title,
          video_url: record.video_url,
          created: record.created,
          tags: record.tags || []
        });
      } catch (error) {
        console.error('Error fetching video:', error);
      }
      setLoading(false);
    }

    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!video) return null;

  return (
    <AnimatedPage>
      <div className="container mx-auto px-2 md:px-4">
        <div className="max-w-4xl mx-auto">
          {getYouTubeVideoId(video.video_url) ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.video_url)}?autoplay=1&hd=1&vq=hd1080&modestbranding=1&playsinline=1&rel=0`}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-lg bg-zinc-800 flex items-center justify-center">
              <p className="text-zinc-400">Invalid YouTube URL</p>
            </div>
          )}
          <div className="mt-4">
            <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
            <div className="flex flex-wrap gap-1 mt-2">
              {video.tags.map((tag, index) => (
                <span
                  key={index}
                  onClick={() => {
                    setSearchQuery(tag);
                    window.history.pushState({}, '', '/');
                  }}
                  className="inline-block px-2 py-1 text-zinc-400 rounded-md text-xs cursor-pointer hover:text-white border border-zinc-700 hover:border-zinc-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
