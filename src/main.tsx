import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const App = () => {
  const handleDownload = async () => {
    const urlInput = document.getElementById('youtubeUrl') as HTMLInputElement;
    const url = urlInput.value;

    if (url) {
      try {
        const response = await fetch('/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (response.ok) {
          alert('Download successful!');
        } else {
          const text = await response.text();
          alert(`Download failed: ${text}`);
        }
      } catch (error) {
        console.error('Download error:', error);
        alert('Download failed.');
      }
    } else {
      alert('Please enter a YouTube URL.');
    }
  };

  return (
    <div>
      <h1>Download YouTube Video</h1>
      <div>
        <label htmlFor="youtubeUrl">YouTube URL:</label>
        <input type="text" id="youtubeUrl" name="youtubeUrl" required />
      </div>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
