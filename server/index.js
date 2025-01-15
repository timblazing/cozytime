import express from 'express';
import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';
import cors from 'cors';
import { access, constants } from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;
const VIDEOS_DIR = process.env.VIDEOS_DIR || join(process.cwd(), 'videos');
const DIST_DIR = join(process.cwd(), 'dist');

// Middleware
app.use(cors());

// Serve static files from dist directory
app.use(express.static(DIST_DIR));

// Serve video files
app.use('/videos', express.static(VIDEOS_DIR));

// API endpoints
app.get('/api/videos', async (req, res) => {
  try {
    await access(VIDEOS_DIR, constants.F_OK);
    const files = await readdir(VIDEOS_DIR);
    const videos = files
      .filter(file => file.match(/\.(mp4|webm|mov)$/i))
      .map((file, index) => ({
        id: String(index + 1),
        title: file.replace(/\.[^/.]+$/, ''),
        path: file
      }));
    res.json(videos);
  } catch (error) {
    console.error('Error reading videos directory:', error);
    res.json([]);
  }
});

// Create videos directory if it doesn't exist
try {
  await mkdir(VIDEOS_DIR, { recursive: true });
  console.log('Videos directory created or already exists at:', VIDEOS_DIR);
} catch (error) {
  console.error('Error creating videos directory:', error);
}

// SPA fallback - must be after API routes
app.get('*', (req, res) => {
  res.sendFile(join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files being served from: ${DIST_DIR}`);
  console.log(`Videos directory: ${VIDEOS_DIR}`);
});
