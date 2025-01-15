FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the application
RUN npm run build

EXPOSE 3005

CMD ["node", "server/index.js"]