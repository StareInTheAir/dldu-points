FROM ghcr.io/voidzero-dev/vite-plus:1.8.0@sha256:648c4e90a1da9f9376ff869e9c1f823faeabc953a0213a67748bbdbdf90b31ae AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:8eb04fe3b385090e9aa02961f77398ad09b6bf33ab07f6669a5bb7acce22c0d3 AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
