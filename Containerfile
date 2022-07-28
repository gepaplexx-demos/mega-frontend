FROM nginx:latest
ENV APPNAME=frontend
ENV NGINX_HTML_DIR=/usr/share/nginx/html
ENV APP_DEST_DIR=usr/src/app

COPY nginx.conf /etc/nginx/nginx.conf
COPY ${APP_DEST_DIR} ${NGINX_HTML_DIR}

CMD ["/bin/bash", "-c", \
"nginx -g 'daemon off;'"]
