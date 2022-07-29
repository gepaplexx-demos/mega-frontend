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
ENV NGINX_DIR=/opt/bitnami/nginx
ENV APP_DEST_DIR=${WORKDIR}/dist/${APPNAME}

COPY nginx-config/nginx.conf ${NGINX_DIR}/conf/nginx.conf
COPY --from=build ${APP_DEST_DIR} ${NGINX_DIR}/html/

CMD ["/bin/bash", "-c", \
"nginx -g 'daemon off;'"]
