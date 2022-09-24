FROM nginx:1.17.1-alpine
COPY dist/nginx.conf /etc/nginx/nginx.conf
COPY dist/front-vitrine /usr/share/nginx/html