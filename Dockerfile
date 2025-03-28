FROM node:22-alpine AS build-stage

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

ENV NODE_ENV=production

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build



FROM scratch AS export-stage
COPY --from=build-stage /app/dist .



FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
