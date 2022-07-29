### STAGE 1: Build ###
FROM node:16.16.0 AS build

ENV WORKDIR=/work

COPY . ${WORKDIR}
WORKDIR ${WORKDIR}

# TODO tests (and lint)
RUN npm install \
   && node ./node_modules/@angular/cli/bin/ng build --configuration=production

### STAGE 2: Run ###
FROM bitnami/nginx:latest

ENV WORKDIR=/work
ENV APPNAME=frontend
ENV NGINX_HTML_DIR=/usr/share/nginx/html
ENV APP_DEST_DIR=${WORKDIR}/dist/${APPNAME}

COPY nginx-config/nginx.conf /etc/nginx/nginx.conf
COPY --from=build ${APP_DEST_DIR} ${NGINX_HTML_DIR}

CMD ["/bin/bash", "-c", \
"nginx -g 'daemon off;'"]
