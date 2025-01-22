import { Dialog, DialogContent } from './ui/dialog';
import { getYouTubeVideoId } from '../utils/youtube';
import type { Video } from '../types/video';

interface WatchDialogProps {
  video: Video | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function WatchDialog({ video, isOpen, setIsOpen }: WatchDialogProps) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
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
      </DialogContent>
    </Dialog>
  );
}
