FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y ffmpeg && apt-get install -y yt-dlp

COPY . .

# Build the application
RUN npm run build

EXPOSE 3005

CMD ["node", "server/index.js"]
