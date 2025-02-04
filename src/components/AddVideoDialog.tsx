import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { addVideo } from '../data/videos';
import { useState } from 'react';

const AVAILABLE_TAGS = [
  'Snowfall',
  'Fall',
  'Winter',
  'Spring',
  'Summer',
  'Fire',
  'Fireplace',
  'Campfire',
  'Cabin',
  'Thunderstorm',
  'Light Rain',
  'Indoors',
  'Nature'
] as const;

interface AddVideoDialogProps {
  refetchVideos: () => void;
  className?: string;
}

export function AddVideoDialog({ refetchVideos, className = '' }: AddVideoDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={`p-2 hover:bg-zinc-800 rounded-full ${className}`}>
          <FontAwesomeIcon icon={faPlus} className="text-lg text-white" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <div className="mx-1 p-6 bg-zinc-900 rounded-xl relative">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
          <FontAwesomeIcon icon={faXmark} className="text-lg text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Add Video</DialogTitle>
          <DialogDescription>
            Add a YouTube video to your collection. Enter the video URL, title, and select any relevant tags.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          
          addVideo({
            title: formData.get('title') as string,
            video_url: formData.get('video_url') as string,
            tags: selectedTags
          });
          form.reset();
          setSelectedTags([]);
          setOpen(false);
          refetchVideos();
        }} className="space-y-4 mt-4">
          <div>
            <label htmlFor="video_url" className="block text-sm font-medium mb-1 text-white">
              YouTube URL
            </label>
            <input
              type="url"
              name="video_url"
              id="video_url"
              required
              className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white placeholder:text-zinc-500"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-white">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="w-full px-3 py-2 bg-zinc-800 rounded-md text-white placeholder:text-zinc-500"
              placeholder="Video title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Tags
            </label>
            <div className="relative">
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag: string) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTags(tags => 
                        tags.includes(tag)
                          ? tags.filter(t => t !== tag)
                          : [...tags, tag]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors text-white bg-zinc-600 ${
                      selectedTags.includes(tag)
                        ? 'bg-opacity-100 underline underline-offset-4'
                        : 'bg-opacity-50 hover:bg-opacity-75'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Add Video
          </button>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
