FROM node:alpine as build-stage

WORKDIR /app
COPY . .
RUN cd frontend && npm install && npm run build

FROM nginx

COPY --from=build-stage /app/frontend/dist/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080