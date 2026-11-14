FROM ghcr.io/voidzero-dev/vite-plus:1.6.0@sha256:eefe84f6bf32756307fe1452b49c81e6b3af98edb328a838ac1e90d6faaa7acc AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:901e593c95dc85f5a729f5765516321366ef4ac401821431d408897e95287d0a AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
