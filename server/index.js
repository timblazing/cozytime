import express from 'express';
import { readdir, mkdir } from 'fs/promises';
import fs from 'fs';
import { join, dirname } from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;
const VIDEOS_DIR = process.env.VIDEOS_DIR || join(__dirname, '..', 'videos');
const THUMBNAILS_DIR = join(__dirname, 'public', 'thumbnails');

// Ensure thumbnails directory exists
fs.mkdir(THUMBNAILS_DIR, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating thumbnails directory:', err);
  } else {
    console.log('Thumbnails directory created or already exists:', THUMBNAILS_DIR);
  }
});

// Middleware
app.use(cors());

// Serve static files from dist directory
app.use(express.static(join(__dirname, '..', 'dist')));
app.use('/thumbnails', express.static(THUMBNAILS_DIR));

// Serve video files
app.get('/videos', async (req, res) => {
  try {
    const files = await readdir(VIDEOS_DIR);
    const videoFiles = files.filter(file => file.match(/\.(mp4|webm|mov)$/i) && !file.startsWith('.'));
    const videoLinks = videoFiles.map(file => `<a href="/videos/${file}">${file}</a>`).join('');
    res.send(`<h1>Available Videos</h1><ul>${videoLinks}</ul>`);
  } catch (error) {
    console.error('Error reading videos directory:', error);
    res.status(500).send('Error loading videos');
  }
});

// Serve individual video files
app.get('/videos/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = join(VIDEOS_DIR, filename);
  
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error('Error accessing video file:', filePath, err);
      return res.status(404).send('Video not found');
    }
    res.sendFile(filePath);
  });
});

// Endpoint to generate and serve video thumbnails
app.get('/thumbnail/:videoName', (req, res) => {
  const videoName = req.params.videoName;
  const videoPath = join(VIDEOS_DIR, videoName);
  const thumbnailPath = join(VIDEOS_DIR, `${videoName.replace(/\.(mp4|webm|mov)$/i, '.jpg')}`);

  // Check if thumbnail already exists
  if (fs.existsSync(thumbnailPath)) {
    console.log('Thumbnail already exists:', thumbnailPath);
    return res.sendFile(thumbnailPath);
  }

  ffmpeg(videoPath)
    .seek('30') // Generate thumbnail at 30 seconds
    .frames(1)
    .output(thumbnailPath)
    .on('end', () => {
      console.log('Thumbnail generated:', thumbnailPath);
      res.sendFile(thumbnailPath);
    })
    .on('error', (err) => {
      console.error('Error generating thumbnail:', err);
      res.status(500).send('Error generating thumbnail');
    })
    .run();
});

// Endpoint to trigger thumbnail generation
app.use(express.json());

app.use(express.json());

app.get('/generate-thumbnails', async (req, res) => {
  console.log('Generating thumbnails...');
  await generateThumbnails();
  res.send('Thumbnails generated successfully.');
});

// SPA fallback - must be after API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
});

// Function to generate thumbnails for all videos
const generateThumbnails = async () => {
  try {
    const files = await readdir(VIDEOS_DIR);
    const videoFiles = files.filter(file => file.match(/\.(mp4|webm|mov)$/i) && !file.startsWith('.'));
    videoFiles.forEach(videoFile => {
      const videoPath = join(VIDEOS_DIR, videoFile);
      const thumbnailPath = join(VIDEOS_DIR, `${videoFile.replace(/\.(mp4|webm|mov)$/i, '.jpg')}`);

      if (!fs.existsSync(thumbnailPath)) {
        ffmpeg(videoPath)
          .seek('30')
          .frames(1)
          .output(thumbnailPath)
          .on('end', () => console.log('Generated thumbnail:', thumbnailPath))
          .on('error', (err) => console.error('Error generating thumbnail:', thumbnailPath, err));
      }
    });
  } catch (error) {
    console.error('Error reading videos directory:', error);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files being served from: ${join(__dirname, '..', 'dist')}`);
  console.log(`Videos directory: ${VIDEOS_DIR}`);
});

generateThumbnails(); // Generate thumbnails on server start
