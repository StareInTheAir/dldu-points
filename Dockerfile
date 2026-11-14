FROM ghcr.io/voidzero-dev/vite-plus:1.5.0@sha256:cce163cdf4cf3fff928925e03a815910be14d34c355fe40b4e79e766fe368f63 AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:901e593c95dc85f5a729f5765516321366ef4ac401821431d408897e95287d0a AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
