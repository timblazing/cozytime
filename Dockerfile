FROM node:20-slim

WORKDIR /app

COPY package*.json ./

# Install system dependencies including Python before npm install
RUN apt-get update && \
    apt-get install -y ffmpeg python3 curl && \
    curl -L https://github.com/ytdl-org/youtube-dl/releases/latest/download/youtube-dl -o /usr/local/bin/youtube-dl && \
    chmod a+rx /usr/local/bin/youtube-dl && \
    ln -s /usr/bin/python3 /usr/bin/python

# Set Python path and install Node dependencies
ENV PYTHON=/usr/bin/python3
RUN npm install

COPY . .

# Build the application
RUN npm run build

EXPOSE 3005

CMD ["node", "server/index.js"]
