# Build instructions

These instructions will let you build dldu-points yourself, if you want to host it yourself.

## API key

A Google Cloud Platform API key is required to access data from Google Sheets. Google enforces [a quota of 300 requests per minute](https://console.cloud.google.com/apis/api/sheets.googleapis.com/quotas). To prevent targeted attacks, no API key is part of the source code. If you want to host your own version you need to create your own API key:

- Visit https://console.cloud.google.com/ and login.
- Create a new project: https://console.cloud.google.com/projectcreate
- Enable the Google Sheets API: https://console.cloud.google.com/apis/library/sheets.googleapis.com
- Create an API key: https://console.cloud.google.com/apis/credentials
- You can setup restrictions for your API key:
  - You can enforce HTTP referer for your own domain name
  - You can limit it to the Google Sheets API


## Build with docker

To build a directly serve this app run:

```shell
docker build \
  --build-arg DLDU_POINTS_API_KEY=YOUR_GOOGLE_API_KEY \
  --build-arg DLDU_POINTS_GIT_HASH=$(git rev-parse --short HEAD) \
  --tag dldu_points \
  --target production-stage \
  .

docker run --publish 8000:80 dldu_points
```

To build this app and output the output files to the `dist` folder, run:

```shell
docker build \
  --build-arg DLDU_POINTS_API_KEY=YOUR_GOOGLE_API_KEY \
  --build-arg DLDU_POINTS_GIT_HASH=$(git rev-parse --short HEAD) \
  --target export-stage \
  --output dist \
  .
```
