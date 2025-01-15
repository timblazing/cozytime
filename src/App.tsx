import { useState, useEffect } from 'react';
import { X, Film } from 'lucide-react';
import { Video } from './types';

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/videos');
        if (!response.ok) {
          throw new Error('Failed to fetch video list');
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        const videoFiles = links
          .map(link => link.getAttribute('href')?.replace('/videos/', ''))
          .filter((filename): filename is string => !!filename && /\.(mp4|webm|mov)$/i.test(filename.toLowerCase()))
          .map((filename, index) => ({
            id: String(index + 1),
            title: filename ? filename.replace(/\.[^/.]+$/, '') : 'Unknown',
            path: filename
          }));
        setVideos(videoFiles);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen background: rgb(88,28,135);
background: linear-gradient(0deg, rgba(88,28,135,1) 0%, rgba(216,180,254,1) 100%); text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen background: rgb(88,28,135);
background: linear-gradient(0deg, rgba(88,28,135,1) 0%, rgba(216,180,254,1) 100%); text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-100"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen background: rgb(88,28,135);
background: linear-gradient(0deg, rgba(88,28,135,1) 0%, rgba(216,180,254,1) 100%); text-white p-4 md:p-8">

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 p-2 hover:text-gray-400"
              aria-label="Close video"
            >
              <X size={24} />
            </button>
            <video
              src={`/videos/${selectedVideo.path}`}
              className="w-full rounded-lg shadow-lg"
              controls
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <h2 className="text-xl font-semibold mt-4">{selectedVideo.title}</h2>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video.id}
              className="cursor-pointer group relative aspect-video rounded-lg overflow-hidden bg-gray-800"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <i className="fas fa-play w-12 h-12"></i>
                </div>
              </div>
              <img
                src={`/thumbnail/${video.path}`}
                alt={`${video.title} Thumbnail`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                <h3 className="text-sm font-medium truncate">{video.title}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Film className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">No videos found.</p>
            <p className="text-gray-500 mt-2">Please add video files to the 'videos' directory.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
