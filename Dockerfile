FROM ghcr.io/voidzero-dev/vite-plus:1.1.0@sha256:15dedad6ab1f100c096aaebac6b0fb40ccf1f3dd0dd0169141e2a56588489b60 AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:0985e772fb9f729e6fa0980da05fca5d9c468e870eed43071545afa9d2e27d94 AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
