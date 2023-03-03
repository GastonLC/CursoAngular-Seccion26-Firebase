FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY /dist/goty /usr/share/nginx/html
EXPOSE 80
