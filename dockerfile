FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=builder /dist/goty /usr/share/nginx/html
EXPOSE 80
