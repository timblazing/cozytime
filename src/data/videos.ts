import type { Video } from '../types/video';

export const videos: Video[] = [
  {
    "id": "77f483z9b9y5z63",
    "title": "Crackling Fireplace Thunderstorms & Sleeping Cats in a Cozy Cabin",
    "video_url": "https://www.youtube.com/watch?v=TQqJNoygVms",
    "created": "2025-01-21 20:17:56.174Z",
    "tags": [
      "Cabin",
      "Thunderstorm",
      "Fireplace",
      "Indoors"
    ]
  },
  {
    "id": "14pt9xtb2fia9xn",
    "title": "Porch with Relaxing Snowfall and Fire Sounds",
    "video_url": "https://www.youtube.com/watch?v=nOZs9fIp0zE&t=80s",
    "created": "2025-01-21 21:21:04.705Z",
    "tags": [
      "Winter",
      "Fire",
      "Nature"
    ]
  },
  {
    "id": "6lf0b5jz34i350c",
    "title": "Relaxing Fireplace",
    "video_url": "https://www.youtube.com/watch?v=vEsOAvYwuQM&t=3s",
    "created": "2025-01-21 21:22:14.350Z",
    "tags": [
      "Fireplace",
      "Fire"
    ]
  },
  {
    "id": "eyn7zr9730t9zj8",
    "title": "Winter Cave with Crackling Fire",
    "video_url": "https://www.youtube.com/watch?v=FslCeCp1GqM&t=30s",
    "created": "2025-01-21 21:23:18.647Z",
    "tags": [
      "Winter",
      "Campfire",
      "Nature"
    ]
  },
  {
    "id": "y9nb5wf7a7nf5h1",
    "title": "Rainy Autumn Day with Crackling Fireplace",
    "video_url": "https://www.youtube.com/watch?v=bmI-4I9mbLE",
    "created": "2025-01-21 21:24:13.337Z",
    "tags": [
      "Fall",
      "Light Rain",
      "Indoors",
      "Fireplace"
    ]
  },
  {
    "id": "n10x0muc83zpw5z",
    "title": "Sitting On The Porch On A Stormy Day",
    "video_url": "https://www.youtube.com/watch?v=JFMY5NxXDhw&t=2s",
    "created": "2025-01-21 21:25:28.965Z",
    "tags": [
      "Cabin",
      "Fireplace",
      "Thunderstorm",
      "Nature"
    ]
  },
  {
    "id": "3736nrwdbm30k28",
    "title": "Cozy Castle Room",
    "video_url": "https://www.youtube.com/watch?v=Ume83dO_fe4",
    "created": "2025-01-21 21:26:34.642Z",
    "tags": [
      "Light Rain",
      "Indoors",
      "Cabin",
      "Fireplace"
    ]
  },
  {
    "id": "9gj70507nyw5153",
    "title": "Peaceful Snowy Cabin & Fireplace",
    "video_url": "https://www.youtube.com/watch?v=-Va4W6BXjps",
    "created": "2025-01-21 22:31:10.678Z",
    "tags": [
      "Indoors",
      "Cabin",
      "Fireplace",
      "Winter"
    ]
  },
  {
    "id": "4763gjr2960izyj",
    "title": "Lightning Ocean Thunderstorm",
    "video_url": "https://www.youtube.com/watch?v=fKRBmFdfjRA&t=3117s",
    "created": "2025-01-21 22:35:32.063Z",
    "tags": [
      "Nature",
      "Thunderstorm"
    ]
  },
  {
    "id": "y8062z3l0ds75q1",
    "title": "Campfire in Foggy Forest",
    "video_url": "https://www.youtube.com/watch?v=8KrLtLr-Gy8&t=22s",
    "created": "2025-01-22 00:01:23.229Z",
    "tags": [
      "Campfire",
      "Nature",
      "Fire"
    ]
  }
];

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function addVideo(video: Omit<Video, 'id' | 'created'>): Video {
  const newVideo: Video = {
    ...video,
    id: generateId(),
    created: new Date().toISOString()
  };
  videos.push(newVideo);
  return newVideo;
}
