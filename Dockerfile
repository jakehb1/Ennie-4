FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/src ./src
COPY backend/public ./public

EXPOSE ${PORT:-3000}

CMD ["node", "src/index.js"]
