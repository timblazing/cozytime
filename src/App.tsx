import { Film } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Video } from './types';

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (import.meta.env.DEV) {
          // Mock data for development
          setVideos([]);
        } else {
          const response = await fetch('/videos');
          if (!response.ok) {
            throw new Error(`Failed to fetch video list: ${response.status} ${response.statusText}`);
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
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please check your network connection and server configuration.');
        setVideos([]);
      }
    };

    fetchVideos();
  }, []);

  const handleDownload = async () => {
    if (!youtubeUrl.trim()) return;

    try {
      const response = await fetch('/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });
      
      if (response.ok) {
        console.log('Download initiated');
        setYoutubeUrl('');
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-purple-300 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/favicon/android-chrome-192x192.png" 
                alt="Cozytime Logo" 
                className="h-8 w-8 mr-2"
              />
              <span className="text-xl font-semibold">Cozytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter YouTube URL"
                className="px-4 py-2 rounded-lg text-black w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
              />
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-4 md:p-8">
        {error && (
          <div className="text-center mb-8">
            <p className="text-red-400 text-xl">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-100"
            >
              Retry
            </button>
          </div>
        )}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-40"></div>
        )}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <video 
                src={`/videos/${selectedVideo.path}`}
                className="w-full rounded-lg shadow-lg"
                controls
                autoPlay
              />
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
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${window.innerWidth < 768 ? 'opacity-100' : 'opacity-0 group-hover:opacity-80 bg-black bg-opacity-40'}`}>
                  <FontAwesomeIcon icon={faPlay} className="text-white text-4xl" />
                </div>
                <img
                  src={`/thumbnail/${video.path}`}
                  alt={`${video.title} Thumbnail`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-sm font-medium truncate">{video.title}</h3>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Film className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-600 text-lg">No videos found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
