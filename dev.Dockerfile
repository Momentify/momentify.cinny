FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["bash", "-c", "npm rebuild esbuild && npm run preview"]