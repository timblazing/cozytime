import { motion } from 'framer-motion';
import type { Video } from '../types/video';
import { getYouTubeThumbnail } from '../utils/youtube';

interface VideoCardProps {
  video: Video;
  index: number;
  setSearchQuery: (query: string) => void;
  onWatch: () => void;
}

export function VideoCard({ video, index, setSearchQuery, onWatch }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.2,
        delay: index * 0.05,
        ease: "easeOut"
      }}
    >
      <button onClick={onWatch} className="block w-full text-left">
        <img
          src={getYouTubeThumbnail(video.video_url)}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
        <div className="mt-2">
          <h3 className="font-medium text-base line-clamp-2">
            {video.title}
          </h3>
        </div>
      </button>
      <div className="flex flex-wrap gap-1 mt-1">
        {video.tags.map((tag, index) => (
          <span
            key={index}
            onClick={() => setSearchQuery(tag)}
            className="inline-block px-2 py-1 text-zinc-400 rounded-md text-xs cursor-pointer hover:text-white border border-zinc-700 hover:border-zinc-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
