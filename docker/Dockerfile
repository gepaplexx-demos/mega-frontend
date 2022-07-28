### STAGE 1: Build ###
FROM node:16.3.0 AS build
ENV APPNAME=incognito-ui
ENV NGINX_HTML_DIR=/usr/share/nginx/html
ENV APP_DEST_DIR=/usr/src/app

WORKDIR ${APP_DEST_DIR}

COPY ${APPNAME} .

### STAGE 2: Run ###
FROM nginx:latest
ENV APPNAME=incognito-ui
ENV NGINX_HTML_DIR=/usr/share/nginx/html
ENV APP_DEST_DIR=/usr/src/app

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build ${APP_DEST_DIR}/${APPNAME} ${NGINX_HTML_DIR}

CMD ["/bin/bash", "-c", \
"echo BASE_API_URL=[$BASE_API_URL], && \
sed -i s#INCOGNITO_UI_BASE_API_URL#$BASE_API_URL#g ${NGINX_HTML_DIR}/main.*.js && \
sed -i s#INCOGNITO_UI_X_API_KEY#$X_API_KEY#g ${NGINX_HTML_DIR}/main.*.js && \
nginx -g 'daemon off;'"]
