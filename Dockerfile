FROM ghcr.io/voidzero-dev/vite-plus:0.3.3@sha256:c25901a17884c55d71e34c1783fa8a77a5eb7e8834735868da775588cd30a1b4 AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:dc5069ad14f19660b141b21236140b91656bf89bbc3e2417c70ae650cd66104c AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
