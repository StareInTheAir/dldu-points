# Build instructions

These instructions will help you build dldu-points, if you want to host it yourself.

## API key

A Google Cloud Platform API key is required to access data from Google Sheets. Google enforces [a quota of 300 requests per minute](https://console.cloud.google.com/apis/api/sheets.googleapis.com/quotas). To prevent targeted attacks, no API key is part of the source code. If you want to host your own version you need to create your own API key:

- Visit https://console.cloud.google.com/ and login.
- Create a new project: https://console.cloud.google.com/projectcreate
- Enable the Google Sheets API: https://console.cloud.google.com/apis/library/sheets.googleapis.com
- Create an API key: https://console.cloud.google.com/apis/credentials
- You can setup restrictions for your API key:
  - You can enforce HTTP referer for your own domain name
  - You can limit it to the Google Sheets API

Create a file named `api.key` in the repository root directory and put your API key into that file. Alternatively you can also set an environment variable:

```shell
export DLDU_POINTS_API_KEY=your_key_here
```

## Git hash

The git commit hash is displayed in [AboutPanel.vue](src/components/AboutPanel.vue). It's automatically fetched during build time, but can be overridden by setting an environment variable:

```shell
export DLDU_POINTS_GIT_HASH=your_hash_here
```

Check [vite.config.ts](vite.config.ts) for the implementation.

## Build

To build this app run:

```shell
pnpm run build
```

The output files are in the `dist` folder.

## Docker image

To build and directly serve this app, git clone this repository and then run:

```shell
docker build \
  --build-arg DLDU_POINTS_API_KEY=YOUR_GOOGLE_API_KEY \
  --build-arg DLDU_POINTS_GIT_HASH=$(git rev-parse --short HEAD) \
  --tag dldu_points \
  .

docker run --publish 8000:80 dldu_points
```

`podman` can also be used instead of `docker`.

dldu-points is now available on http://localhost:8000
