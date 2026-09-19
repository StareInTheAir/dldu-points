FROM ghcr.io/voidzero-dev/vite-plus:0.3.3@sha256:c25901a17884c55d71e34c1783fa8a77a5eb7e8834735868da775588cd30a1b4 AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:ef8676b33d681f272ba429b27658bdd7e640963279714c96bddf1dc76307f7b6 AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
