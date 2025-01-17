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

app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send('No YouTube URL provided');
  }

  const videoId = new URL(url).searchParams.get('v');
  const outputPath = join(VIDEOS_DIR, `${videoId}.mp4`);

  console.log(`Downloading video from: ${url} to ${outputPath}`);

  const maxRetries = 3;
  let retryCount = 0;

  async function downloadVideo(retryAttempt) {
    return new Promise(async (resolve, reject) => {
      try {
        const ytdl = await import('ytdl-core');
        
        const options = {
          requestOptions: {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5'
            }
          }
        };

        // Get video info first
        const info = await ytdl.default.getInfo(url, options);
        
        // Find the best format under 720p
        const formats = info.formats
          .filter(format => format.height && format.height <= 720)
          .sort((a, b) => b.height - a.height);

        if (formats.length === 0) {
          throw new Error('No suitable video format found');
        }

        const writeStream = fs.createWriteStream(outputPath);
        const stream = ytdl.default.downloadFromInfo(info, {
          ...options,
          format: formats[0]
        });

        stream.pipe(writeStream);

        await new Promise((resolveStream, rejectStream) => {
          writeStream.on('finish', () => {
            console.log(`Video downloaded successfully to ${outputPath}`);
            resolveStream();
          });
          writeStream.on('error', rejectStream);
          stream.on('error', rejectStream);
        });

        resolve();
      } catch (error) {
        console.error(`Download error (attempt ${retryAttempt}):`, error);
        reject(error);
      }
    });
  }

  async function attemptDownload() {
    while (retryCount < maxRetries) {
      retryCount++;
      console.log(`Attempting download (retry ${retryCount}/${maxRetries})...`);
      try {
        await downloadVideo(retryCount);
        return true; // Download successful
      } catch (error) {
        console.error(`Download failed (retry ${retryCount}/${maxRetries}): ${error}`);
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
      }
    }
    return false; // Download failed after all retries
  }

  try {
    const downloadSuccessful = await attemptDownload();
    if (downloadSuccessful) {
      res.status(200).send('Download successful');
    } else {
      res.status(500).send('Download failed after multiple retries.');
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send(`Download failed: ${error.message}`);
  }
});

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
