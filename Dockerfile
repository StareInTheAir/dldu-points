FROM ghcr.io/voidzero-dev/vite-plus:1.6.0@sha256:eefe84f6bf32756307fe1452b49c81e6b3af98edb328a838ac1e90d6faaa7acc AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:caf4e1e032a20f9c3c5e28fc7f25ffd768ad8677b4975c54193075997b3a97e3 AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
