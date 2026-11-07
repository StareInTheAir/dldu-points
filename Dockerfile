FROM ghcr.io/voidzero-dev/vite-plus:1.5.0@sha256:cce163cdf4cf3fff928925e03a815910be14d34c355fe40b4e79e766fe368f63 AS build

ARG DLDU_POINTS_API_KEY
ARG DLDU_POINTS_GIT_HASH

WORKDIR /app
COPY --chown=vp:vp . .

RUN vp install --frozen-lockfile && vpr build

FROM docker.io/nginx:stable-alpine@sha256:583b7f2fce1cdb8da5ad5c39ebd3c33b98b87d493190e548bdee1fa8c619c311 AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
