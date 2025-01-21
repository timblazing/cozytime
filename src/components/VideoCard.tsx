import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Video } from '../types/video';
import { getYouTubeThumbnail } from '../utils/youtube';

interface VideoCardProps {
  video: Video;
  index: number;
}

export function VideoCard({ video, index }: VideoCardProps) {
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
      <Link to={`/watch/${video.id}`}>
      <img
        src={getYouTubeThumbnail(video.video_url)}
        alt={video.title}
        className="w-full aspect-video object-cover rounded-lg"
      />
      <div className="mt-2">
        <h3 className="font-medium text-base line-clamp-2">
          {video.title}
        </h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {video.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      </Link>
    </motion.div>
  );
}
