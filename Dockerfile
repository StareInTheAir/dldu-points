FROM ghcr.io/voidzero-dev/vite-plus:0.3.3@sha256:c25901a17884c55d71e34c1783fa8a77a5eb7e8834735868da775588cd30a1b4 AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:985220252f3863977e468f611ef118ebd01421289dd86ee1ae99cb068c3bce2b AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
