FROM node:16.17.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=builder /app/dist/goty /usr/share/nginx/html
EXPOSE 80