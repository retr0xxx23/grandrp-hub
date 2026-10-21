# Build context is the repository root; the application lives in "GrandRP HUB/".
FROM node:22-alpine

WORKDIR /app

COPY ["GrandRP HUB/package.json", "./"]
RUN npm install --omit=dev

COPY ["GrandRP HUB/.", "./"]

ENV NODE_ENV=production
ENV PORT=10000
ENV DATA_DIR=/data

EXPOSE 10000

CMD ["npm", "start"]
