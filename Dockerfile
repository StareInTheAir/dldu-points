FROM ghcr.io/voidzero-dev/vite-plus:1.4.0@sha256:5dfa2031f7d014b6376407fd99e0747bed329d792c79c184a65ec9a0765bee0e AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:0e52bd054126cdc040b1276c0af347aeb02a41b9cfe305d6094767ac30e97949 AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
