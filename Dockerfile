FROM node:alpine as build-stage

WORKDIR /app
COPY . .
RUN cd frontend
RUN npm install
RUN npm run build

FROM nginx

COPY --from=build-stage ./frontend/dist/ /usr/share/nginx/html
COPY --from=build-stage ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080