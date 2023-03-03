FROM nginx:latest
WORKDIR /app
COPY /app/dist/goty /usr/share/nginx/html
EXPOSE 80
